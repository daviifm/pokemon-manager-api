"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeApiAxiosGateway = void 0;
// src/infrastructure/gateways/poke-api-axios-gateway.ts
const axios_1 = __importDefault(require("axios"));
const cockatiel_1 = require("cockatiel");
const zod_1 = require("zod");
const app_error_1 = require("../../domain/errors/app-error.js");
// ---------------------------------------------------------------------------
// 1. Anti-Corruption Layer: o "contrato" do que esperamos da PokéAPI.
//    Se a PokéAPI mudar o formato, o Zod quebra AQUI (borda), e não no domínio.
// ---------------------------------------------------------------------------
const pokeApiResponseSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    name: zod_1.z.string().min(1),
    base_experience: zod_1.z.number().int().nullable().optional(),
    height: zod_1.z.number().int().nullable().optional(),
    weight: zod_1.z.number().int().nullable().optional(),
    types: zod_1.z.array(zod_1.z.object({ type: zod_1.z.object({ name: zod_1.z.string() }) })).min(1),
    stats: zod_1.z.array(zod_1.z.object({
        base_stat: zod_1.z.number().int(),
        stat: zod_1.z.object({ name: zod_1.z.string() }),
    })),
    sprites: zod_1.z.object({
        front_default: zod_1.z.string().nullable().optional(),
        other: zod_1.z
            .object({
            'official-artwork': zod_1.z
                .object({ front_default: zod_1.z.string().nullable().optional() })
                .optional(),
        })
            .optional(),
    }),
});
const EXTERNAL_UNAVAILABLE_MESSAGE = 'Serviço externo (PokeAPI) temporariamente indisponível. Tente novamente em instantes.';
// Só vale a pena repetir falhas TRANSITÓRIAS: sem resposta (timeout/rede), 5xx e 429.
// Um 404 é resposta definitiva ("não existe"): repetir seria desperdício.
function isTransient(error) {
    if (!axios_1.default.isAxiosError(error))
        return false;
    const status = error.response?.status;
    if (status === undefined)
        return true;
    return status >= 500 || status === 429;
}
class PokeApiAxiosGateway {
    http;
    policy;
    constructor(options = {}) {
        const baseURL = options.baseUrl ??
            process.env.POKEAPI_BASE_URL ??
            'https://pokeapi.co/api/v2';
        const timeout = options.timeoutMs ?? Number(process.env.POKEAPI_TIMEOUT_MS ?? 3000);
        const attempts = options.maxAttempts ?? 3;
        this.http = axios_1.default.create({ baseURL, timeout });
        // Retry com backoff exponencial. No cockatiel, `maxAttempts` = nº de RETRIES,
        // então subtraímos 1 para que `attempts` seja o total de tentativas.
        const retryPolicy = (0, cockatiel_1.retry)((0, cockatiel_1.handleWhen)(isTransient), {
            maxAttempts: Math.max(attempts - 1, 0),
            backoff: new cockatiel_1.ExponentialBackoff({ initialDelay: 100, maxDelay: 1000 }),
        });
        // Circuit Breaker: após 5 falhas seguidas, "abre" por 10s e falha rápido
        // (sem nem chamar a PokéAPI), protegendo a nossa API de ficar pendurada.
        const breakerPolicy = (0, cockatiel_1.circuitBreaker)((0, cockatiel_1.handleWhen)(isTransient), {
            halfOpenAfter: 10_000,
            breaker: new cockatiel_1.ConsecutiveBreaker(5),
        });
        // wrap(retry, breaker): cada tentativa passa pelo breaker.
        this.policy = (0, cockatiel_1.wrap)(retryPolicy, breakerPolicy);
    }
    async findByName(name) {
        let raw;
        try {
            const response = await this.policy.execute(() => this.http.get(`/pokemon/${encodeURIComponent(name.trim().toLowerCase())}`));
            raw = response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                return null; // espécie inexistente: o Use Case decide o que fazer
            }
            // Timeout, rede, 5xx, 429, circuito aberto... tudo vira 503 limpo.
            throw new app_error_1.AppError(EXTERNAL_UNAVAILABLE_MESSAGE, 503);
        }
        const parsed = pokeApiResponseSchema.safeParse(raw);
        if (!parsed.success) {
            // A PokéAPI respondeu, mas num formato que não conhecemos.
            throw new app_error_1.AppError('A PokeAPI retornou dados em formato inesperado. Tente novamente mais tarde.', 502);
        }
        return this.toDomain(parsed.data);
    }
    toDomain(data) {
        const stat = (statName) => data.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;
        return {
            pokedexNumber: data.id,
            name: data.name,
            types: data.types.map((t) => t.type.name),
            baseStats: {
                hp: stat('hp'),
                attack: stat('attack'),
                defense: stat('defense'),
                specialAttack: stat('special-attack'),
                specialDefense: stat('special-defense'),
                speed: stat('speed'),
            },
            spriteUrl: data.sprites.other?.['official-artwork']?.front_default ??
                data.sprites.front_default ??
                null,
            baseExperience: data.base_experience ?? null,
            height: data.height ?? null,
            weight: data.weight ?? null,
        };
    }
}
exports.PokeApiAxiosGateway = PokeApiAxiosGateway;
