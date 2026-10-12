"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrainerUseCase = void 0;
// src/application/use-cases/update-trainer.ts
const trainer_1 = require("../../domain/entities/trainer.js");
const not_found_error_1 = require("../../domain/errors/not-found-error.js");
class UpdateTrainerUseCase {
    trainerRepository;
    constructor(trainerRepository) {
        this.trainerRepository = trainerRepository;
    }
    async execute(id, data) {
        const existing = await this.trainerRepository.findById(id);
        if (!existing) {
            throw new not_found_error_1.NotFoundError('Treinador não encontrado');
        }
        const updated = new trainer_1.Trainer({
            id: existing.id,
            name: data.name ?? existing.name,
            email: data.email ?? existing.email,
            city: data.city ?? existing.city,
        });
        await this.trainerRepository.update(updated);
        return updated;
    }
}
exports.UpdateTrainerUseCase = UpdateTrainerUseCase;
