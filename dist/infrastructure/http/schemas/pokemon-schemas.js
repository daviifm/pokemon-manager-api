"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPokemonsQuerySchema = exports.listPokemonsQuerySchema = exports.idParamSchema = exports.updatePokemonLevelSchema = exports.replacePokemonSchema = exports.createPokemonSchema = void 0;
// src/infrastructure/http/schemas/pokemon-schemas.ts
const zod_1 = require("zod");
const pokemon_type_1 = require("../../../domain/value-objects/pokemon-type.js");
const pokemon_1 = require("../../../domain/entities/pokemon.js");
// Aceita "FIRE", "Fire" ou "fire": normaliza para minúsculas e só então confere
// se é um dos 18 tipos oficiais (a mesma lista usada pelo domínio).
const pokemonTypeSchema = zod_1.z
    .string({ invalid_type_error: 'O tipo deve ser um texto' })
    .trim()
    .toLowerCase()
    .pipe(zod_1.z.enum(pokemon_type_1.POKEMON_TYPES, {
    errorMap: () => ({
        message: `Tipo inválido. Use um destes: ${pokemon_type_1.POKEMON_TYPES.join(', ')}`,
    }),
}));
const levelSchema = zod_1.z
    .number({
    required_error: 'O nível é obrigatório',
    invalid_type_error: 'O nível deve ser um número',
})
    .int('O nível deve ser um número inteiro')
    .min(pokemon_1.MIN_LEVEL, `O nível deve ser no mínimo ${pokemon_1.MIN_LEVEL}`)
    .max(pokemon_1.MAX_LEVEL, `O nível deve ser no máximo ${pokemon_1.MAX_LEVEL}`);
const uuidSchema = (label) => zod_1.z
    .string({ invalid_type_error: `${label} deve ser um texto` })
    .uuid(`${label} deve ser um UUID válido`);
// POST /pokemons: o cliente informa só o nome da espécie (+ nível); o resto vem da PokéAPI.
exports.createPokemonSchema = zod_1.z.object({
    name: zod_1.z
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
exports.replacePokemonSchema = zod_1.z.object({
    level: levelSchema,
    trainerId: uuidSchema('O trainerId')
        .nullish()
        .transform((v) => v ?? null),
});
// PATCH /pokemons/:id/level
exports.updatePokemonLevelSchema = zod_1.z.object({ level: levelSchema });
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('O id deve ser um UUID válido'),
});
// Query strings chegam SEMPRE como texto: convertemos para número na borda.
const intQuery = (label, min, max, fallback) => zod_1.z
    .string()
    .optional()
    .transform((value, ctx) => {
    if (value === undefined || value === '')
        return fallback;
    const n = Number(value);
    if (!Number.isInteger(n)) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `${label} deve ser um número inteiro`,
        });
        return zod_1.z.NEVER;
    }
    if (n < min || n > max) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: `${label} deve estar entre ${min} e ${max}`,
        });
        return zod_1.z.NEVER;
    }
    return n;
});
// GET /pokemons?type=&minLevel=&maxLevel=&trainerId=&page=&limit=
exports.listPokemonsQuerySchema = zod_1.z
    .object({
    type: pokemonTypeSchema.optional(),
    minLevel: intQuery('minLevel', pokemon_1.MIN_LEVEL, pokemon_1.MAX_LEVEL, pokemon_1.MIN_LEVEL),
    maxLevel: intQuery('maxLevel', pokemon_1.MIN_LEVEL, pokemon_1.MAX_LEVEL, pokemon_1.MAX_LEVEL),
    trainerId: uuidSchema('O trainerId').optional(),
    page: intQuery('page', 1, Number.MAX_SAFE_INTEGER, 1),
    limit: intQuery('limit', 1, 50, 10),
})
    .refine((q) => q.minLevel <= q.maxLevel, {
    message: 'minLevel não pode ser maior que maxLevel',
    path: ['minLevel'],
});
// GET /pokemons/search?name=
exports.searchPokemonsQuerySchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'O parâmetro name é obrigatório' })
        .trim()
        .min(1, 'O parâmetro name é obrigatório'),
});
