"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePokemonController = makePokemonController;
const in_memory_pokemon_repository_1 = require("@infrastructure/database/in-memory/in-memory-pokemon-repository");
const prisma_pokemon_repository_1 = require("@infrastructure/database/prisma/prisma-pokemon-repository");
const in_memory_pokemon_gateway_1 = require("@infrastructure/gateways/in-memory-pokemon-gateway");
const poke_api_gateway_1 = require("@infrastructure/gateways/poke-api-gateway");
const pokemon_controller_1 = require("@infrastructure/http/controllers/pokemon-controller");
const create_pokemon_1 = require("@application/use-cases/create-pokemon");
const import_pokemon_from_pokeapi_1 = require("@application/use-cases/import-pokemon-from-pokeapi");
const list_pokemons_1 = require("@application/use-cases/list-pokemons");
const get_pokemon_by_id_1 = require("@application/use-cases/get-pokemon-by-id");
const update_pokemon_1 = require("@application/use-cases/update-pokemon");
const delete_pokemon_1 = require("@application/use-cases/delete-pokemon");
const get_pokemon_stats_1 = require("@application/use-cases/get-pokemon-stats");
// Em testes (NODE_ENV=test) usamos dublês em memória: zero banco, zero internet.
const isTestEnvironment = process.env.NODE_ENV === 'test';
// Instâncias únicas: o repositório precisa ser compartilhado por todos os Use
// Cases e o gateway precisa ser único para o circuit breaker lembrar das falhas.
const pokemonRepository = isTestEnvironment
    ? new in_memory_pokemon_repository_1.InMemoryPokemonRepository()
    : new prisma_pokemon_repository_1.PrismaPokemonRepository();
const pokemonGateway = isTestEnvironment
    ? new in_memory_pokemon_gateway_1.InMemoryPokemonGateway()
    : new poke_api_gateway_1.PokeApiGateway();
function makePokemonController() {
    return new pokemon_controller_1.PokemonController(new create_pokemon_1.CreatePokemonUseCase(pokemonRepository), new import_pokemon_from_pokeapi_1.ImportPokemonFromPokeApiUseCase(pokemonRepository, pokemonGateway), new list_pokemons_1.ListPokemonsUseCase(pokemonRepository), new get_pokemon_by_id_1.GetPokemonByIdUseCase(pokemonRepository), new update_pokemon_1.UpdatePokemonUseCase(pokemonRepository), new delete_pokemon_1.DeletePokemonUseCase(pokemonRepository), new get_pokemon_stats_1.GetPokemonStatsUseCase(pokemonRepository));
}
