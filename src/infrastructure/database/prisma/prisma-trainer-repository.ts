// src/infrastructure/database/prisma/prisma-trainer-repository.ts
import { Trainer as TrainerRow } from '@prisma/client';
import { Trainer } from '@domain/entities/trainer';
import { TrainerRepository } from '@domain/repositories/trainer-repository';
import { prisma } from './client';

function toDomain(row: TrainerRow): Trainer {
  return new Trainer({
    id: row.id,
    name: row.name,
    email: row.email,
    city: row.city,
  });
}

export class PrismaTrainerRepository implements TrainerRepository {
  // E-mail repetido => Prisma lança P2002 => PrismaErrorMapper => 409
  async create(trainer: Trainer): Promise<void> {
    await prisma.trainer.create({
      data: {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        city: trainer.city,
      },
    });
  }

  async findAll(): Promise<Trainer[]> {
    const rows = await prisma.trainer.findMany({
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Trainer | null> {
    const row = await prisma.trainer.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async update(trainer: Trainer): Promise<void> {
    await prisma.trainer.update({
      where: { id: trainer.id },
      data: { name: trainer.name, email: trainer.email, city: trainer.city },
    });
  }

  // Transação (tudo ou nada): solta os Pokémons e só então remove o treinador.
  // Id inexistente => `delete` lança P2025 => a transação inteira é desfeita
  // e o PrismaErrorMapper responde 404.
  async delete(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.pokemon.updateMany({
        where: { trainerId: id },
        data: { trainerId: null },
      }),
      prisma.trainer.delete({ where: { id } }),
    ]);
  }
}
