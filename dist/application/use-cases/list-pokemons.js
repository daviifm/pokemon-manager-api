"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPokemonsUseCase = void 0;
class ListPokemonsUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(filters) {
        return this.pokemonRepository.findAll(filters);
    }
}
exports.ListPokemonsUseCase = ListPokemonsUseCase;
