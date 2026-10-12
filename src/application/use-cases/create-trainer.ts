// src/application/use-cases/create-trainer.ts
import { randomUUID } from 'node:crypto';
import { Trainer } from '@domain/entities/trainer';
import { TrainerRepository } from '@domain/repositories/trainer-repository';
import { CreateTrainerDTO } from '@application/dtos/trainer-dtos';

export class CreateTrainerUseCase {
  constructor(private readonly trainerRepository: TrainerRepository) {}

  async execute(data: CreateTrainerDTO): Promise<Trainer> {
    const trainer = new Trainer({ id: randomUUID(), ...data });

    // E-mail duplicado? Quem barra é a constraint UNIQUE do banco: o erro nativo
    // (Prisma P2002 / PostgreSQL 23505) é traduzido para 409 na infraestrutura.
    await this.trainerRepository.create(trainer);
    return trainer;
  }
}
