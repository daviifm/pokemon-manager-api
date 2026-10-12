// src/application/use-cases/get-trainer-by-id.ts
import { Trainer } from '@domain/entities/trainer';
import { NotFoundError } from '@domain/errors/not-found-error';
import { TrainerRepository } from '@domain/repositories/trainer-repository';

export class GetTrainerByIdUseCase {
  constructor(private readonly trainerRepository: TrainerRepository) {}

  async execute(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);

    if (!trainer) {
      throw new NotFoundError('Treinador não encontrado');
    }

    return trainer;
  }
}
