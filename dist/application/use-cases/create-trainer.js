"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTrainerUseCase = void 0;
// src/application/use-cases/create-trainer.ts
const node_crypto_1 = require("node:crypto");
const trainer_1 = require("../../domain/entities/trainer.js");
class CreateTrainerUseCase {
    trainerRepository;
    constructor(trainerRepository) {
        this.trainerRepository = trainerRepository;
    }
    async execute(data) {
        const trainer = new trainer_1.Trainer({ id: (0, node_crypto_1.randomUUID)(), ...data });
        // E-mail duplicado? Quem barra é a constraint UNIQUE do banco: o erro nativo
        // (Prisma P2002 / PostgreSQL 23505) é traduzido para 409 na infraestrutura.
        await this.trainerRepository.create(trainer);
        return trainer;
    }
}
exports.CreateTrainerUseCase = CreateTrainerUseCase;
