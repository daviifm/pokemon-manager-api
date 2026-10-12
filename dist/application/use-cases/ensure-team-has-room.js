"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureTeamHasRoom = ensureTeamHasRoom;
// src/application/use-cases/ensure-team-has-room.ts
const trainer_1 = require("../../domain/entities/trainer.js");
const conflict_error_1 = require("../../domain/errors/conflict-error.js");
// Regra dos 6 Pokémons, compartilhada por quem adiciona alguém a um time
// (criar com trainerId, ou atribuir um Pokémon existente a um treinador).
async function ensureTeamHasRoom(pokemonRepository, trainerId) {
    const teamSize = await pokemonRepository.countByTrainerId(trainerId);
    if (teamSize >= trainer_1.MAX_TEAM_SIZE) {
        throw new conflict_error_1.ConflictError(`O treinador já possui o limite máximo de ${trainer_1.MAX_TEAM_SIZE} Pokémons em seu time`);
    }
}
