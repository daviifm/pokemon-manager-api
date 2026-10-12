"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeApiGateway = void 0;
// src/infrastructure/gateways/poke-api-gateway.ts
const axios_1 = __importDefault(require("axios"));
const cockatiel_1 = require("cockatiel");
const zod_1 = require("zod");
const app_error_1 = require("../../domain/errors/app-error.js");
// ---------------------------------------------------------------------------
// 1. DTO PRIVADO: reflete a resposta "feia/nativa" da PokéAPI (só o que usamos).
//    Validamos com Zod porque dado externo é território não confiável: se a
//    PokéAPI mudar o formato, o erro morre AQUI (502), sem contaminar o domínio.
// ---------------------------------------------------------------------------
const pokeApiPokemonSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    name: zod_1.z.string().min(1),
    types: zod_1.z
        .array(zod_1.z.object({ slot: zod_1.z.number(), type: zod_1.z.object({ name: zod_1.z.string() }) }))
        .min(1),
    stats: zod_1.z.array(zod_1.z.object({ base_stat: zod_1.z.number(), stat: zod_1.z.object({ name: zod_1.z.string() }) })),
    sprites: zod_1.z.object({
        other: zod_1.z
            .object({
            'official-artwork': zod_1.z
                .object({ front_default: zod_1.z.string().nullable().optional() })
                .optional(),
        })
            .optional(),
    }),
});
// Nome do stat na PokéAPI (kebab-case) -> nome no nosso domínio (camelCase)
const STAT_NAME_MAP = {
    hp: 'hp',
    attack: 'attack',
    defense: 'defense',
    'special-attack': 'specialAttack',
    'special-defense': 'specialDefense',
    speed: 'speed',
};
// Falha "transitória": vale a pena tentar de novo e conta para o disjuntor.
// Timeout/rede (sem resposta), 5xx e 429. NUNCA 4xx (ex: 404 não muda tentando de novo).
function isTransientError(error) {
    if (!axios_1.default.isAxiosError(error))
        return false;
    if (!error.response)
        return true;
    return error.response.status >= 500 || error.response.status === 429;
}
class PokeApiGateway {
    baseUrl;
    timeoutMs;
    // IMPORTANTE: as políticas são campos da instância (e a instância é única,
    // criada na factory) para o circuit breaker "lembrar" das falhas entre chamadas.
    policy;
    constructor(options = {}) {
        this.baseUrl = options.baseUrl ?? 'https://pokeapi.co/api/v2';
        this.timeoutMs = options.timeoutMs ?? 3000;
        const transient = (0, cockatiel_1.handleWhen)(isTransientError);
        // Retentativas com backoff exponencial + jitter (1º retry ~1s, depois ~2s...)
        const retryPolicy = (0, cockatiel_1.retry)(transient, {
            // No cockatiel, maxAttempts conta só as RETENTATIVAS (além da 1ª chamada).
            // Subtraímos 1 para que a opção signifique "tentativas totais".
            maxAttempts: (options.maxAttempts ?? 3) - 1,
            backoff: new cockatiel_1.ExponentialBackoff({
                initialDelay: options.retryInitialDelayMs ?? 1000,
                maxDelay: options.retryMaxDelayMs ?? 4000,
            }),
        });
        // Circuit Breaker: após N falhas consecutivas, "abre" e responde na hora
        const breakerPolicy = (0, cockatiel_1.circuitBreaker)(transient, {
            halfOpenAfter: options.halfOpenAfterMs ?? 10_000,
            breaker: new cockatiel_1.ConsecutiveBreaker(options.breakerThreshold ?? 5),
        });
        // retry por fora, breaker por dentro: cada tentativa passa pelo disjuntor
        this.policy = (0, cockatiel_1.wrap)(retryPolicy, breakerPolicy);
    }
    async findByIdOrName(identifier) {
        // encodeURIComponent evita que um valor malicioso altere o caminho da URL
        const path = encodeURIComponent(String(identifier).trim().toLowerCase());
        let raw;
        try {
            raw = await this.policy.execute(() => this.fetchPokemon(path));
        }
        catch (error) {
            // Erros que já são nossos (ex: 502 de resposta inesperada) passam direto
            if (error instanceof app_error_1.AppError)
                throw error;
            if (error instanceof cockatiel_1.BrokenCircuitError) {
                throw new app_error_1.AppError('O serviço da PokéAPI está instável no momento (circuit breaker aberto). Tente novamente em instantes', 503);
            }
            throw new app_error_1.AppError('O serviço da PokéAPI está indisponível ou demorou para responder', 503);
        }
        // 404 não é falha de infraestrutura: é "esse Pokémon não existe"
        if (raw === null)
            return null;
        return this.toExternalPokemonData(raw);
    }
    async fetchPokemon(path) {
        const response = await axios_1.default.get(`${this.baseUrl}/pokemon/${path}`, {
            timeout: this.timeoutMs,
            // 5xx e 429 viram exceção (transitórias -> retry/breaker).
            // Demais status (200, 404, 400...) voltam normalmente para tratarmos abaixo.
            validateStatus: (status) => status < 500 && status !== 429,
        });
        if (response.status === 404)
            return null;
        if (response.status >= 400) {
            throw new app_error_1.AppError('A PokéAPI respondeu de forma inesperada', 502);
        }
        return response.data;
    }
    // ----- Camada Anti-Corrupção: valida e traduz o formato da PokéAPI -----
    toExternalPokemonData(raw) {
        const parsed = pokeApiPokemonSchema.safeParse(raw);
        if (!parsed.success) {
            throw new app_error_1.AppError('A PokéAPI retornou dados em um formato inesperado', 502);
        }
        const data = parsed.data;
        const baseStats = {};
        for (const entry of data.stats) {
            const key = STAT_NAME_MAP[entry.stat.name];
            if (key)
                baseStats[key] = entry.base_stat;
        }
        const missing = Object.values(STAT_NAME_MAP).filter((key) => baseStats[key] === undefined);
        if (missing.length > 0) {
            throw new app_error_1.AppError('A PokéAPI retornou stats incompletos para este Pokémon', 502);
        }
        return {
            id: data.id,
            name: data.name,
            // slot 1 = tipo primário, slot 2 = secundário
            types: [...data.types]
                .sort((a, b) => a.slot - b.slot)
                .map((entry) => entry.type.name),
            baseStats: baseStats,
            spriteUrl: data.sprites.other?.['official-artwork']?.front_default ?? null,
        };
    }
}
exports.PokeApiGateway = PokeApiGateway;
