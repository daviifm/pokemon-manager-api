"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePokemonUseCase = void 0;
const Pokemon_1 = require("@domain/entities/Pokemon");
const PokemonNotFoundError_1 = require("@domain/errors/PokemonNotFoundError");
class UpdatePokemonUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id, data) {
        const existing = await this.repository.findById(id);
        if (!existing)
            throw new PokemonNotFoundError_1.PokemonNotFoundError(id);
        const updated = new Pokemon_1.Pokemon({
            id: existing.id,
            name: data.name ?? existing.name,
            type: data.type ?? existing.type,
        });
        await this.repository.update(updated);
        return updated;
    }
}
exports.UpdatePokemonUseCase = UpdatePokemonUseCase;
