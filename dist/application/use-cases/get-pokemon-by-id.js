"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPokemonByIdUseCase = void 0;
const not_found_error_1 = require("@domain/errors/not-found-error");
class GetPokemonByIdUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(id) {
        const pokemon = await this.pokemonRepository.findById(id);
        if (!pokemon) {
            throw new not_found_error_1.NotFoundError(`Pokémon #${id}`);
        }
        return pokemon;
    }
}
exports.GetPokemonByIdUseCase = GetPokemonByIdUseCase;
