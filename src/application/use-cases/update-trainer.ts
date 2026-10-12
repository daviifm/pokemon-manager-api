// src/application/use-cases/update-trainer.ts
import { Trainer } from '@domain/entities/trainer';
import { NotFoundError } from '@domain/errors/not-found-error';
import { TrainerRepository } from '@domain/repositories/trainer-repository';
import { UpdateTrainerDTO } from '@application/dtos/trainer-dtos';

export class UpdateTrainerUseCase {
  constructor(private readonly trainerRepository: TrainerRepository) {}

  async execute(id: string, data: UpdateTrainerDTO): Promise<Trainer> {
    const existing = await this.trainerRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('Treinador não encontrado');
    }

    const updated = new Trainer({
      id: existing.id,
      name: data.name ?? existing.name,
      email: data.email ?? existing.email,
      city: data.city ?? existing.city,
    });

    await this.trainerRepository.update(updated);
    return updated;
  }
}
