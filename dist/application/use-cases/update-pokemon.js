"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePokemonUseCase = void 0;
const not_found_error_1 = require("../../domain/errors/not-found-error.js");
const ensure_team_has_room_1 = require("./ensure-team-has-room");
class UpdatePokemonUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(id, data) {
        const existing = await this.pokemonRepository.findById(id);
        if (!existing) {
            throw new not_found_error_1.NotFoundError('Pokémon não encontrado');
        }
        // Mudou de treinador? Então o time de destino precisa ter vaga.
        if (data.trainerId && data.trainerId !== existing.trainerId) {
            await (0, ensure_team_has_room_1.ensureTeamHasRoom)(this.pokemonRepository, data.trainerId);
        }
        const updated = existing.with({
            level: data.level,
            trainerId: data.trainerId,
        });
        await this.pokemonRepository.update(updated);
        return updated;
    }
}
exports.UpdatePokemonUseCase = UpdatePokemonUseCase;
