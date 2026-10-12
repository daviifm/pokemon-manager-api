"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonNotFoundError = void 0;
class PokemonNotFoundError extends Error {
    constructor(id) {
        super(`Pokémon com id ${id} não encontrado`);
        this.name = 'PokemonNotFoundError';
    }
}
exports.PokemonNotFoundError = PokemonNotFoundError;
