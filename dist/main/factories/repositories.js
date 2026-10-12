"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDbDriver = resolveDbDriver;
exports.makeRepositories = makeRepositories;
const in_memory_pokemon_repository_1 = require("../../infrastructure/database/in-memory/in-memory-pokemon-repository.js");
const in_memory_trainer_repository_1 = require("../../infrastructure/database/in-memory/in-memory-trainer-repository.js");
const pg_pokemon_repository_1 = require("../../infrastructure/database/pg/pg-pokemon-repository.js");
const pg_trainer_repository_1 = require("../../infrastructure/database/pg/pg-trainer-repository.js");
const prisma_pokemon_repository_1 = require("../../infrastructure/database/prisma/prisma-pokemon-repository.js");
const prisma_trainer_repository_1 = require("../../infrastructure/database/prisma/prisma-trainer-repository.js");
function resolveDbDriver() {
    if (process.env.NODE_ENV === 'test')
        return 'memory';
    const driver = (process.env.DB_DRIVER ?? 'prisma').toLowerCase();
    if (driver === 'prisma' || driver === 'pg' || driver === 'memory')
        return driver;
    throw new Error(`DB_DRIVER inválido: "${driver}". Use prisma, pg ou memory.`);
}
// Singleton: pokémons e treinadores compartilham o mesmo "banco" (importante na memória).
let cached;
function makeRepositories() {
    if (cached)
        return cached;
    switch (resolveDbDriver()) {
        case 'pg':
            cached = {
                pokemonRepository: new pg_pokemon_repository_1.PgPokemonRepository(),
                trainerRepository: new pg_trainer_repository_1.PgTrainerRepository(),
            };
            break;
        case 'memory': {
            const pokemonRepository = new in_memory_pokemon_repository_1.InMemoryPokemonRepository();
            cached = {
                pokemonRepository,
                trainerRepository: new in_memory_trainer_repository_1.InMemoryTrainerRepository(pokemonRepository),
            };
            break;
        }
        default:
            cached = {
                pokemonRepository: new prisma_pokemon_repository_1.PrismaPokemonRepository(),
                trainerRepository: new prisma_trainer_repository_1.PrismaTrainerRepository(),
            };
    }
    return cached;
}
