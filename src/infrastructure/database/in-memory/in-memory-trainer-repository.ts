// src/infrastructure/database/in-memory/in-memory-trainer-repository.ts
import { Trainer } from '@domain/entities/trainer';
import { ConflictError } from '@domain/errors/conflict-error';
import { NotFoundError } from '@domain/errors/not-found-error';
import { TrainerRepository } from '@domain/repositories/trainer-repository';
import { InMemoryPokemonRepository } from './in-memory-pokemon-repository';

export class InMemoryTrainerRepository implements TrainerRepository {
  private trainers: Trainer[] = [];

  // Recebe o repositório de Pokémons para soltá-los ao remover o treinador.
  constructor(private readonly pokemonRepository: InMemoryPokemonRepository) {}

  async create(trainer: Trainer): Promise<void> {
    this.assertEmailIsFree(trainer);
    this.trainers.push(trainer);
  }

  async findAll(): Promise<Trainer[]> {
    return [...this.trainers];
  }

  async findById(id: string): Promise<Trainer | null> {
    return this.trainers.find((t) => t.id === id) ?? null;
  }

  async update(trainer: Trainer): Promise<void> {
    this.assertEmailIsFree(trainer);
    const index = this.trainers.findIndex((t) => t.id === trainer.id);
    if (index >= 0) this.trainers[index] = trainer;
  }

  async delete(id: string): Promise<void> {
    if (!this.trainers.some((t) => t.id === id)) {
      throw new NotFoundError('Treinador não encontrado no banco de dados');
    }
    this.pokemonRepository.releaseAllFromTrainer(id);
    this.trainers = this.trainers.filter((t) => t.id !== id);
  }

  private assertEmailIsFree(trainer: Trainer): void {
    if (
      this.trainers.some(
        (t) => t.email === trainer.email && t.id !== trainer.id,
      )
    ) {
      throw new ConflictError(
        'Já existe um Treinador cadastrado com este e-mail.',
      );
    }
  }
}
