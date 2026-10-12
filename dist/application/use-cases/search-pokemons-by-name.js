"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPokemonsByNameUseCase = void 0;
class SearchPokemonsByNameUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(term) {
        return this.pokemonRepository.searchByName(term);
    }
}
exports.SearchPokemonsByNameUseCase = SearchPokemonsByNameUseCase;
