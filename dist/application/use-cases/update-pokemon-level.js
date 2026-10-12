"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePokemonLevelUseCase = void 0;
const not_found_error_1 = require("../../domain/errors/not-found-error.js");
class UpdatePokemonLevelUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(id, newLevel) {
        const existing = await this.pokemonRepository.findById(id);
        if (!existing) {
            throw new not_found_error_1.NotFoundError('Pokémon não encontrado');
        }
        // Revalida a regra do nível (1 a 100) no domínio antes de tocar no banco
        const updated = existing.with({ level: newLevel });
        await this.pokemonRepository.updateLevel(id, updated.level);
        return updated;
    }
}
exports.UpdatePokemonLevelUseCase = UpdatePokemonLevelUseCase;
