// src/application/use-cases/list-trainers.ts
import { Trainer } from '@domain/entities/trainer';
import { TrainerRepository } from '@domain/repositories/trainer-repository';

export class ListTrainersUseCase {
  constructor(private readonly trainerRepository: TrainerRepository) {}

  async execute(): Promise<Trainer[]> {
    return this.trainerRepository.findAll();
  }
}
