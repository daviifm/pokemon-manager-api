// src/application/use-cases/delete-trainer.ts
import { TrainerRepository } from '@domain/repositories/trainer-repository';

export class DeleteTrainerUseCase {
  constructor(private readonly trainerRepository: TrainerRepository) {}

  // Os Pokémons do treinador NÃO são apagados: o repositório os "solta"
  // (trainerId = null) e remove o treinador de forma atômica (transação).
  // Id inexistente: o banco sinaliza (Prisma P2025) e o errorHandler responde 404.
  async execute(id: string): Promise<void> {
    await this.trainerRepository.delete(id);
  }
}
