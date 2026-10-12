"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePokemonUseCase = void 0;
const PokemonNotFoundError_1 = require("../../domain/errors/PokemonNotFoundError.js");
class DeletePokemonUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id) {
        const pokemon = await this.repository.findById(id);
        if (!pokemon)
            throw new PokemonNotFoundError_1.PokemonNotFoundError(id);
        await this.repository.delete(id);
    }
}
exports.DeletePokemonUseCase = DeletePokemonUseCase;
