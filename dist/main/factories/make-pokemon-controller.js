"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePokemonController = makePokemonController;
const create_pokemon_1 = require("../../application/use-cases/create-pokemon.js");
const delete_pokemon_1 = require("../../application/use-cases/delete-pokemon.js");
const get_pokemon_by_id_1 = require("../../application/use-cases/get-pokemon-by-id.js");
const get_pokemon_stats_1 = require("../../application/use-cases/get-pokemon-stats.js");
const list_pokemons_1 = require("../../application/use-cases/list-pokemons.js");
const search_pokemons_by_name_1 = require("../../application/use-cases/search-pokemons-by-name.js");
const update_pokemon_level_1 = require("../../application/use-cases/update-pokemon-level.js");
const update_pokemon_1 = require("../../application/use-cases/update-pokemon.js");
const in_memory_pokemon_gateway_1 = require("../../infrastructure/gateways/in-memory-pokemon-gateway.js");
const poke_api_axios_gateway_1 = require("../../infrastructure/gateways/poke-api-axios-gateway.js");
const pokemon_controller_1 = require("../../infrastructure/http/controllers/pokemon-controller.js");
const repositories_1 = require("./repositories");
// USE_EXTERNAL_API=false (ou NODE_ENV=test) troca a PokéAPI real por um gateway
// em memória: dá para desenvolver offline e rodar testes sem rede.
function makeGateway() {
    const useReal = process.env.USE_EXTERNAL_API !== 'false' && process.env.NODE_ENV !== 'test';
    return useReal ? new poke_api_axios_gateway_1.PokeApiAxiosGateway() : new in_memory_pokemon_gateway_1.InMemoryPokemonGateway();
}
function makePokemonController() {
    const { pokemonRepository } = (0, repositories_1.makeRepositories)();
    const gateway = makeGateway();
    return new pokemon_controller_1.PokemonController(new create_pokemon_1.CreatePokemonUseCase(pokemonRepository, gateway), new list_pokemons_1.ListPokemonsUseCase(pokemonRepository), new search_pokemons_by_name_1.SearchPokemonsByNameUseCase(pokemonRepository), new get_pokemon_by_id_1.GetPokemonByIdUseCase(pokemonRepository), new update_pokemon_1.UpdatePokemonUseCase(pokemonRepository), new update_pokemon_level_1.UpdatePokemonLevelUseCase(pokemonRepository), new delete_pokemon_1.DeletePokemonUseCase(pokemonRepository), new get_pokemon_stats_1.GetPokemonStatsUseCase(pokemonRepository));
}
