"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/main/config/swagger-generator.ts
const path_1 = __importDefault(require("path"));
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const baseStatsExample = {
    hp: 45,
    attack: 49,
    defense: 49,
    specialAttack: 65,
    specialDefense: 65,
    speed: 45,
};
const doc = {
    info: {
        version: '2.0.0',
        title: 'PokéManager API',
        description: 'API RESTful para gerenciamento de um catálogo de Pokémons voltado ao competitivo/Nuzlocke (tipos, status base e sprites), construída com Clean Architecture, PostgreSQL (Prisma), validação com Zod e integração com a PokéAPI.',
    },
    host: 'localhost:3333',
    basePath: '/api/v1',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        { name: 'Pokemons', description: 'Endpoints de gerenciamento de Pokémons' },
    ],
    definitions: {
        Pokemon: {
            id: 1,
            name: 'bulbasaur',
            types: ['grass', 'poison'],
            baseStats: { ...baseStatsExample, total: 318 },
            spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        },
        CreatePokemon: {
            $id: 1,
            $name: 'bulbasaur',
            $types: ['grass', 'poison'],
            $baseStats: baseStatsExample,
            spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        },
        ReplacePokemon: {
            $name: 'bulbasaur',
            $types: ['grass', 'poison'],
            $baseStats: baseStatsExample,
            spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        },
        PatchPokemon: {
            name: 'bulbasaur',
            types: ['grass', 'poison'],
            baseStats: baseStatsExample,
        },
        ImportPokemon: {
            $pokemon: 'pikachu',
        },
        PokemonCreatedResponse: {
            message: 'Pokémon cadastrado com sucesso!',
            data: {
                id: 1,
                name: 'bulbasaur',
                types: ['grass', 'poison'],
                baseStats: { ...baseStatsExample, total: 318 },
                spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
            },
        },
        PokemonStats: {
            totalPokemons: 4,
            typesCount: { grass: 2, poison: 1, fire: 1 },
        },
        ErrorResponse: {
            status: 'error',
            message: 'Pokémon #25 não encontrado(a)',
        },
        ValidationErrorResponse: {
            status: 'error',
            message: 'Dados de entrada inválidos',
            details: [
                {
                    field: 'types.0',
                    message: 'Tipo inválido. Use um destes: normal, fire, ...',
                },
            ],
        },
    },
};
const outputFile = path_1.default.resolve(__dirname, 'swagger-output.json');
// O gerador parte do app.ts, que monta '/api/v1' -> routes -> pokemon-routes.
const endpointsFiles = [path_1.default.resolve(__dirname, '../app.ts')];
(0, swagger_autogen_1.default)({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
