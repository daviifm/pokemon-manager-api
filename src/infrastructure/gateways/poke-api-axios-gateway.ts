// src/infrastructure/gateways/poke-api-axios-gateway.ts
import axios, { AxiosInstance } from 'axios';
import {
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
  ExternalPokemonDetails,
  PokemonExternalGateway,
} from '@domain/gateways/pokemon-external-gateway';

// ---------------------------------------------------------------------------
// 1. Anti-Corruption Layer: o "contrato" do que esperamos da PokéAPI.
//    Se a PokéAPI mudar o formato, o Zod quebra AQUI (borda), e não no domínio.
// ---------------------------------------------------------------------------
const pokeApiResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  base_experience: z.number().int().nullable().optional(),
  height: z.number().int().nullable().optional(),
  weight: z.number().int().nullable().optional(),
  types: z.array(z.object({ type: z.object({ name: z.string() }) })).min(1),
  stats: z.array(
    z.object({
      base_stat: z.number().int(),
      stat: z.object({ name: z.string() }),
    }),
  ),
  sprites: z.object({
    front_default: z.string().nullable().optional(),
    other: z
      .object({
        'official-artwork': z
          .object({ front_default: z.string().nullable().optional() })
          .optional(),
      })
      .optional(),
  }),
});

type PokeApiResponse = z.infer<typeof pokeApiResponseSchema>;

const EXTERNAL_UNAVAILABLE_MESSAGE =
  'Serviço externo (PokeAPI) temporariamente indisponível. Tente novamente em instantes.';

export interface PokeApiGatewayOptions {
  baseUrl?: string;
  timeoutMs?: number;
  maxAttempts?: number; // total de tentativas (1 original + retries)
}

// Só vale a pena repetir falhas TRANSITÓRIAS: sem resposta (timeout/rede), 5xx e 429.
// Um 404 é resposta definitiva ("não existe"): repetir seria desperdício.
function isTransient(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  if (status === undefined) return true;
  return status >= 500 || status === 429;
}

export class PokeApiAxiosGateway implements PokemonExternalGateway {
  private readonly http: AxiosInstance;
  private readonly policy;

  constructor(options: PokeApiGatewayOptions = {}) {
    const baseURL =
      options.baseUrl ??
      process.env.POKEAPI_BASE_URL ??
      'https://pokeapi.co/api/v2';
    const timeout =
      options.timeoutMs ?? Number(process.env.POKEAPI_TIMEOUT_MS ?? 3000);
    const attempts = options.maxAttempts ?? 3;

    this.http = axios.create({ baseURL, timeout });

    // Retry com backoff exponencial. No cockatiel, `maxAttempts` = nº de RETRIES,
    // então subtraímos 1 para que `attempts` seja o total de tentativas.
    const retryPolicy = retry(handleWhen(isTransient), {
      maxAttempts: Math.max(attempts - 1, 0),
      backoff: new ExponentialBackoff({ initialDelay: 100, maxDelay: 1000 }),
    });

    // Circuit Breaker: após 5 falhas seguidas, "abre" por 10s e falha rápido
    // (sem nem chamar a PokéAPI), protegendo a nossa API de ficar pendurada.
    const breakerPolicy = circuitBreaker(handleWhen(isTransient), {
      halfOpenAfter: 10_000,
      breaker: new ConsecutiveBreaker(5),
    });

    // wrap(retry, breaker): cada tentativa passa pelo breaker.
    this.policy = wrap(retryPolicy, breakerPolicy);
  }

  async findByName(name: string): Promise<ExternalPokemonDetails | null> {
    let raw: unknown;

    try {
      const response = await this.policy.execute(() =>
        this.http.get(
          `/pokemon/${encodeURIComponent(name.trim().toLowerCase())}`,
        ),
      );
      raw = (response as { data: unknown }).data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // espécie inexistente: o Use Case decide o que fazer
      }
      // Timeout, rede, 5xx, 429, circuito aberto... tudo vira 503 limpo.
      throw new AppError(EXTERNAL_UNAVAILABLE_MESSAGE, 503);
    }

    const parsed = pokeApiResponseSchema.safeParse(raw);
    if (!parsed.success) {
      // A PokéAPI respondeu, mas num formato que não conhecemos.
      throw new AppError(
        'A PokeAPI retornou dados em formato inesperado. Tente novamente mais tarde.',
        502,
      );
    }

    return this.toDomain(parsed.data);
  }

  private toDomain(data: PokeApiResponse): ExternalPokemonDetails {
    const stat = (statName: string): number =>
      data.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;

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
      spriteUrl:
        data.sprites.other?.['official-artwork']?.front_default ??
        data.sprites.front_default ??
        null,
      baseExperience: data.base_experience ?? null,
      height: data.height ?? null,
      weight: data.weight ?? null,
    };
  }
}
