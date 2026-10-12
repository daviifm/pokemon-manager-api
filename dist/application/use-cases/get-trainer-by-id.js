"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTrainerByIdUseCase = void 0;
const not_found_error_1 = require("../../domain/errors/not-found-error.js");
class GetTrainerByIdUseCase {
    trainerRepository;
    constructor(trainerRepository) {
        this.trainerRepository = trainerRepository;
    }
    async execute(id) {
        const trainer = await this.trainerRepository.findById(id);
        if (!trainer) {
            throw new not_found_error_1.NotFoundError('Treinador não encontrado');
        }
        return trainer;
    }
}
exports.GetTrainerByIdUseCase = GetTrainerByIdUseCase;
