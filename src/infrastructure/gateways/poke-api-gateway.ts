// src/infrastructure/gateways/poke-api-gateway.ts
import axios from 'axios';
import {
  BrokenCircuitError,
  ConsecutiveBreaker,
  ExponentialBackoff,
  circuitBreaker,
  handleWhen,
  retry,
  wrap,
} from 'cockatiel';
import { z } from 'zod';
import { AppError } from '@domain/errors/app-error';
import {
  ExternalPokemonData,
  PokemonExternalGateway,
} from '@domain/gateways/pokemon-external-gateway';
import { BaseStatsProps } from '@domain/value-objects/base-stats';

// ---------------------------------------------------------------------------
// 1. DTO PRIVADO: reflete a resposta "feia/nativa" da PokéAPI (só o que usamos).
//    Validamos com Zod porque dado externo é território não confiável: se a
//    PokéAPI mudar o formato, o erro morre AQUI (502), sem contaminar o domínio.
// ---------------------------------------------------------------------------
const pokeApiPokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  types: z
    .array(z.object({ slot: z.number(), type: z.object({ name: z.string() }) }))
    .min(1),
  stats: z.array(
    z.object({ base_stat: z.number(), stat: z.object({ name: z.string() }) }),
  ),
  sprites: z.object({
    other: z
      .object({
        'official-artwork': z
          .object({ front_default: z.string().nullable().optional() })
          .optional(),
      })
      .optional(),
  }),
});

type PokeApiPokemon = z.infer<typeof pokeApiPokemonSchema>;

// Nome do stat na PokéAPI (kebab-case) -> nome no nosso domínio (camelCase)
const STAT_NAME_MAP: Record<string, keyof BaseStatsProps> = {
  hp: 'hp',
  attack: 'attack',
  defense: 'defense',
  'special-attack': 'specialAttack',
  'special-defense': 'specialDefense',
  speed: 'speed',
};

export interface PokeApiGatewayOptions {
  baseUrl?: string;
  timeoutMs?: number;
  maxAttempts?: number;
  retryInitialDelayMs?: number;
  retryMaxDelayMs?: number;
  breakerThreshold?: number;
  halfOpenAfterMs?: number;
}

// Falha "transitória": vale a pena tentar de novo e conta para o disjuntor.
// Timeout/rede (sem resposta), 5xx e 429. NUNCA 4xx (ex: 404 não muda tentando de novo).
function isTransientError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  if (!error.response) return true;
  return error.response.status >= 500 || error.response.status === 429;
}

export class PokeApiGateway implements PokemonExternalGateway {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  // IMPORTANTE: as políticas são campos da instância (e a instância é única,
  // criada na factory) para o circuit breaker "lembrar" das falhas entre chamadas.
  private readonly policy;

  constructor(options: PokeApiGatewayOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'https://pokeapi.co/api/v2';
    this.timeoutMs = options.timeoutMs ?? 3000;

    const transient = handleWhen(isTransientError);

    // Retentativas com backoff exponencial + jitter (1º retry ~1s, depois ~2s...)
    const retryPolicy = retry(transient, {
      // No cockatiel, maxAttempts conta só as RETENTATIVAS (além da 1ª chamada).
      // Subtraímos 1 para que a opção signifique "tentativas totais".
      maxAttempts: (options.maxAttempts ?? 3) - 1,
      backoff: new ExponentialBackoff({
        initialDelay: options.retryInitialDelayMs ?? 1000,
        maxDelay: options.retryMaxDelayMs ?? 4000,
      }),
    });

    // Circuit Breaker: após N falhas consecutivas, "abre" e responde na hora
    const breakerPolicy = circuitBreaker(transient, {
      halfOpenAfter: options.halfOpenAfterMs ?? 10_000,
      breaker: new ConsecutiveBreaker(options.breakerThreshold ?? 5),
    });

    // retry por fora, breaker por dentro: cada tentativa passa pelo disjuntor
    this.policy = wrap(retryPolicy, breakerPolicy);
  }

  async findByIdOrName(
    identifier: string | number,
  ): Promise<ExternalPokemonData | null> {
    // encodeURIComponent evita que um valor malicioso altere o caminho da URL
    const path = encodeURIComponent(String(identifier).trim().toLowerCase());

    let raw: unknown;
    try {
      raw = await this.policy.execute(() => this.fetchPokemon(path));
    } catch (error) {
      // Erros que já são nossos (ex: 502 de resposta inesperada) passam direto
      if (error instanceof AppError) throw error;

      if (error instanceof BrokenCircuitError) {
        throw new AppError(
          'O serviço da PokéAPI está instável no momento (circuit breaker aberto). Tente novamente em instantes',
          503,
        );
      }

      throw new AppError(
        'O serviço da PokéAPI está indisponível ou demorou para responder',
        503,
      );
    }

    // 404 não é falha de infraestrutura: é "esse Pokémon não existe"
    if (raw === null) return null;

    return this.toExternalPokemonData(raw);
  }

  private async fetchPokemon(path: string): Promise<unknown> {
    const response = await axios.get(`${this.baseUrl}/pokemon/${path}`, {
      timeout: this.timeoutMs,
      // 5xx e 429 viram exceção (transitórias -> retry/breaker).
      // Demais status (200, 404, 400...) voltam normalmente para tratarmos abaixo.
      validateStatus: (status) => status < 500 && status !== 429,
    });

    if (response.status === 404) return null;

    if (response.status >= 400) {
      throw new AppError('A PokéAPI respondeu de forma inesperada', 502);
    }

    return response.data;
  }

  // ----- Camada Anti-Corrupção: valida e traduz o formato da PokéAPI -----
  private toExternalPokemonData(raw: unknown): ExternalPokemonData {
    const parsed = pokeApiPokemonSchema.safeParse(raw);
    if (!parsed.success) {
      throw new AppError(
        'A PokéAPI retornou dados em um formato inesperado',
        502,
      );
    }

    const data: PokeApiPokemon = parsed.data;

    const baseStats: Partial<BaseStatsProps> = {};
    for (const entry of data.stats) {
      const key = STAT_NAME_MAP[entry.stat.name];
      if (key) baseStats[key] = entry.base_stat;
    }

    const missing = Object.values(STAT_NAME_MAP).filter(
      (key) => baseStats[key] === undefined,
    );
    if (missing.length > 0) {
      throw new AppError(
        'A PokéAPI retornou stats incompletos para este Pokémon',
        502,
      );
    }

    return {
      id: data.id,
      name: data.name,
      // slot 1 = tipo primário, slot 2 = secundário
      types: [...data.types]
        .sort((a, b) => a.slot - b.slot)
        .map((entry) => entry.type.name),
      baseStats: baseStats as BaseStatsProps,
      spriteUrl:
        data.sprites.other?.['official-artwork']?.front_default ?? null,
    };
  }
}
