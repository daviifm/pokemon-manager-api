"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPokemonStatsUseCase = void 0;
class GetPokemonStatsUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute() {
        const pokemons = await this.pokemonRepository.findAll();
        const typesCount = {};
        for (const pokemon of pokemons) {
            // Um Pokémon de tipo duplo (ex: Bulbasaur) conta em AMBOS os baldes.
            for (const type of pokemon.types) {
                typesCount[type] = (typesCount[type] ?? 0) + 1;
            }
        }
        return { totalPokemons: pokemons.length, typesCount };
    }
}
exports.GetPokemonStatsUseCase = GetPokemonStatsUseCase;
