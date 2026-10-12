// src/infrastructure/http/schemas/pokemon-schemas.ts
import { z } from 'zod';
import { POKEMON_TYPES } from '@domain/value-objects/pokemon-type';
import { MAX_LEVEL, MIN_LEVEL } from '@domain/entities/pokemon';

// Aceita "FIRE", "Fire" ou "fire": normaliza para minúsculas e só então confere
// se é um dos 18 tipos oficiais (a mesma lista usada pelo domínio).
const pokemonTypeSchema = z
  .string({ invalid_type_error: 'O tipo deve ser um texto' })
  .trim()
  .toLowerCase()
  .pipe(
    z.enum(POKEMON_TYPES, {
      errorMap: () => ({
        message: `Tipo inválido. Use um destes: ${POKEMON_TYPES.join(', ')}`,
      }),
    }),
  );

const levelSchema = z
  .number({
    required_error: 'O nível é obrigatório',
    invalid_type_error: 'O nível deve ser um número',
  })
  .int('O nível deve ser um número inteiro')
  .min(MIN_LEVEL, `O nível deve ser no mínimo ${MIN_LEVEL}`)
  .max(MAX_LEVEL, `O nível deve ser no máximo ${MAX_LEVEL}`);

const uuidSchema = (label: string) =>
  z
    .string({ invalid_type_error: `${label} deve ser um texto` })
    .uuid(`${label} deve ser um UUID válido`);

// POST /pokemons: o cliente informa só o nome da espécie (+ nível); o resto vem da PokéAPI.
export const createPokemonSchema = z.object({
  name: z
    .string({
      required_error: 'O nome é obrigatório',
      invalid_type_error: 'O nome deve ser um texto',
    })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres'),
  type: pokemonTypeSchema.optional(),
  level: levelSchema,
  trainerId: uuidSchema('O trainerId').nullish(),
});

// PUT /pokemons/:id (substituição): nível obrigatório; trainerId ausente/null = selvagem.
export const replacePokemonSchema = z.object({
  level: levelSchema,
  trainerId: uuidSchema('O trainerId')
    .nullish()
    .transform((v) => v ?? null),
});

// PATCH /pokemons/:id/level
export const updatePokemonLevelSchema = z.object({ level: levelSchema });

export const idParamSchema = z.object({
  id: z.string().uuid('O id deve ser um UUID válido'),
});

// Query strings chegam SEMPRE como texto: convertemos para número na borda.
const intQuery = (label: string, min: number, max: number, fallback: number) =>
  z
    .string()
    .optional()
    .transform((value, ctx) => {
      if (value === undefined || value === '') return fallback;
      const n = Number(value);
      if (!Number.isInteger(n)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} deve ser um número inteiro`,
        });
        return z.NEVER;
      }
      if (n < min || n > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} deve estar entre ${min} e ${max}`,
        });
        return z.NEVER;
      }
      return n;
    });

// GET /pokemons?type=&minLevel=&maxLevel=&trainerId=&page=&limit=
export const listPokemonsQuerySchema = z
  .object({
    type: pokemonTypeSchema.optional(),
    minLevel: intQuery('minLevel', MIN_LEVEL, MAX_LEVEL, MIN_LEVEL),
    maxLevel: intQuery('maxLevel', MIN_LEVEL, MAX_LEVEL, MAX_LEVEL),
    trainerId: uuidSchema('O trainerId').optional(),
    page: intQuery('page', 1, Number.MAX_SAFE_INTEGER, 1),
    limit: intQuery('limit', 1, 50, 10),
  })
  .refine((q) => q.minLevel <= q.maxLevel, {
    message: 'minLevel não pode ser maior que maxLevel',
    path: ['minLevel'],
  });

// GET /pokemons/search?name=
export const searchPokemonsQuerySchema = z.object({
  name: z
    .string({ required_error: 'O parâmetro name é obrigatório' })
    .trim()
    .min(1, 'O parâmetro name é obrigatório'),
});

export type CreatePokemonInput = z.infer<typeof createPokemonSchema>;
export type ListPokemonsQuery = z.infer<typeof listPokemonsQuerySchema>;
