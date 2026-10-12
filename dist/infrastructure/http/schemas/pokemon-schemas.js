"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPokemonsQuerySchema = exports.importPokemonSchema = exports.patchPokemonSchema = exports.replacePokemonSchema = exports.createPokemonSchema = exports.pokemonIdParamsSchema = void 0;
// src/infrastructure/http/schemas/pokemon-schemas.ts
const zod_1 = require("zod");
const pokemon_type_1 = require("@domain/value-objects/pokemon-type");
// ---------------------------------------------------------------------------
// Validação de BORDA (formato/sintaxe). Regras que dependem do estado do
// sistema (ex: "este id já existe?") ficam nos Use Cases, não aqui.
// ---------------------------------------------------------------------------
const idSchema = zod_1.z.coerce
    .number({ invalid_type_error: 'O id deve ser um número' })
    .int('O id deve ser um número inteiro')
    .positive('O id deve ser positivo');
// Higieniza ("  Grass " -> "grass") e só então confere se é um dos 18 tipos.
const typeSchema = zod_1.z
    .string({
    required_error: 'O tipo é obrigatório',
    invalid_type_error: 'O tipo deve ser texto',
})
    .trim()
    .toLowerCase()
    .pipe(zod_1.z.enum(pokemon_type_1.POKEMON_TYPES, {
    errorMap: () => ({
        message: `Tipo inválido. Use um destes: ${pokemon_type_1.POKEMON_TYPES.join(', ')}`,
    }),
}));
const typesSchema = zod_1.z
    .array(typeSchema, {
    required_error: 'Os tipos são obrigatórios',
    invalid_type_error: 'Os tipos devem ser uma lista',
})
    .min(1, 'Informe ao menos 1 tipo')
    .max(2, 'Um Pokémon pode ter no máximo 2 tipos')
    .refine((types) => new Set(types).size === types.length, {
    message: 'Os tipos não podem se repetir',
});
const statSchema = (label) => zod_1.z
    .number({
    required_error: `${label} é obrigatório`,
    invalid_type_error: `${label} deve ser um número`,
})
    .int(`${label} deve ser um número inteiro`)
    .min(1, `${label} deve ser no mínimo 1`)
    .max(255, `${label} deve ser no máximo 255`);
const baseStatsSchema = zod_1.z.object({
    hp: statSchema('HP'),
    attack: statSchema('Attack'),
    defense: statSchema('Defense'),
    specialAttack: statSchema('Sp. Attack'),
    specialDefense: statSchema('Sp. Defense'),
    speed: statSchema('Speed'),
}, { required_error: 'Os status base (baseStats) são obrigatórios' });
const nameSchema = zod_1.z
    .string({
    required_error: 'O nome é obrigatório',
    invalid_type_error: 'O nome deve ser texto',
})
    .trim()
    .min(1, 'O nome é obrigatório');
const spriteUrlSchema = zod_1.z.string().url('A URL do sprite é inválida').nullish();
// --- Params: /pokemons/:id -------------------------------------------------
exports.pokemonIdParamsSchema = zod_1.z.object({ id: idSchema });
// --- POST /pokemons (cadastro manual) ---------------------------------------
exports.createPokemonSchema = zod_1.z.object({
    id: idSchema,
    name: nameSchema,
    types: typesSchema,
    baseStats: baseStatsSchema,
    spriteUrl: spriteUrlSchema,
});
// --- PUT /pokemons/:id (substituição COMPLETA: todos os campos obrigatórios) -
exports.replacePokemonSchema = exports.createPokemonSchema.omit({ id: true });
// --- PATCH /pokemons/:id (atualização PARCIAL: ao menos 1 campo) ------------
exports.patchPokemonSchema = exports.replacePokemonSchema
    .partial()
    .refine((body) => Object.keys(body).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
});
// --- POST /pokemons/import (busca na PokéAPI) --------------------------------
// Aceita o número da Pokédex (25) ou o nome ("pikachu"). A regex impede
// caracteres que poderiam alterar o caminho da URL chamada na PokéAPI.
exports.importPokemonSchema = zod_1.z.object({
    pokemon: zod_1.z.union([
        zod_1.z.number().int().positive(),
        zod_1.z
            .string()
            .trim()
            .toLowerCase()
            .regex(/^[a-z0-9-]+$/, 'Use apenas letras, números e hífen (ex: "pikachu" ou "mr-mime")'),
    ], {
        errorMap: () => ({
            message: 'Informe o nome ou o número da Pokédex do Pokémon',
        }),
    }),
});
// --- GET /pokemons?type=grass -------------------------------------------------
exports.listPokemonsQuerySchema = zod_1.z.object({
    type: typeSchema.optional(),
});
