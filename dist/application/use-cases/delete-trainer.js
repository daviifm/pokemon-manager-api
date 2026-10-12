"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTrainerUseCase = void 0;
class DeleteTrainerUseCase {
    trainerRepository;
    constructor(trainerRepository) {
        this.trainerRepository = trainerRepository;
    }
    // Os Pokémons do treinador NÃO são apagados: o repositório os "solta"
    // (trainerId = null) e remove o treinador de forma atômica (transação).
    // Id inexistente: o banco sinaliza (Prisma P2025) e o errorHandler responde 404.
    async execute(id) {
        await this.trainerRepository.delete(id);
    }
}
exports.DeleteTrainerUseCase = DeleteTrainerUseCase;
