"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePokemonUseCase = void 0;
// src/application/use-cases/delete-pokemon.ts
const not_found_error_1 = require("@domain/errors/not-found-error");
class DeletePokemonUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(id) {
        const pokemon = await this.pokemonRepository.findById(id);
        if (!pokemon) {
            throw new not_found_error_1.NotFoundError(`Pokémon #${id}`);
        }
        await this.pokemonRepository.delete(id);
    }
}
exports.DeletePokemonUseCase = DeletePokemonUseCase;
