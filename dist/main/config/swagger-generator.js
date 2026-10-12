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
const trainerId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
const pokemon = {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    pokedexNumber: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    level: 5,
    baseStats: { ...baseStatsExample, total: 318 },
    trainerId,
    spriteUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    baseExperience: 64,
    height: 7,
    weight: 69,
};
const trainer = {
    id: trainerId,
    name: 'Ash Ketchum',
    email: 'ash@pallet.com',
    city: 'Pallet Town',
};
const doc = {
    info: {
        version: '2.1.0',
        title: 'PokéManager API',
        description: 'API RESTful para gerenciamento de um catálogo de Pokémons voltado ao competitivo/Nuzlocke (tipos, status base e sprites), construída com Clean Architecture, PostgreSQL (Prisma), validação com Zod e integração com a PokéAPI.',
    },
    host: 'localhost:3333',
    basePath: '/api/v1',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            name: 'Pokemons',
            description: 'Catálogo de Pokémons (dados enriquecidos pela PokéAPI)',
        },
        {
            name: 'Trainers',
            description: 'Treinadores e seus times (máximo de 6 Pokémons)',
        },
    ],
    definitions: {
        Pokemon: pokemon,
        CreatePokemon: {
            $name: 'bulbasaur',
            type: 'grass',
            $level: 5,
            trainerId: trainerId,
        },
        ReplacePokemon: { $level: 20, trainerId: trainerId },
        PatchLevel: { $level: 36 },
        PokemonResponse: { data: pokemon },
        PokemonCreatedResponse: {
            message: 'Pokémon cadastrado com sucesso!',
            data: pokemon,
        },
        PokemonListResponse: {
            data: [pokemon],
            meta: { page: 1, limit: 10, total: 1 },
        },
        PokemonListSimpleResponse: { data: [pokemon] },
        PokemonStats: {
            totalPokemons: 3,
            typesCount: { grass: 1, poison: 1, fire: 1 },
        },
        Trainer: trainer,
        CreateTrainer: {
            $name: 'Ash Ketchum',
            $email: 'ash@pallet.com',
            $city: 'Pallet Town',
        },
        UpdateTrainer: { city: 'Viridian City' },
        TrainerCreatedResponse: {
            message: 'Treinador cadastrado com sucesso!',
            data: trainer,
        },
        TrainerListResponse: { data: [trainer] },
        ErrorResponse: {
            status: 'error',
            statusCode: 404,
            message: 'Pokémon não encontrado no banco de dados',
        },
        ValidationErrorResponse: {
            status: 'error',
            statusCode: 400,
            message: 'Dados de entrada inválidos',
            details: [{ field: 'level', message: 'O nível deve ser no máximo 100' }],
        },
    },
};
const outputFile = path_1.default.resolve(__dirname, 'swagger-output.json');
// O gerador parte do app.ts, que monta '/api/v1' -> routes -> pokemon-routes.
const endpointsFiles = [path_1.default.resolve(__dirname, '../app.ts')];
(0, swagger_autogen_1.default)({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
