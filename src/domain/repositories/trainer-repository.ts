// src/domain/repositories/trainer-repository.ts
import { Trainer } from '@domain/entities/trainer';

export interface TrainerRepository {
  create(trainer: Trainer): Promise<void>;
  findAll(): Promise<Trainer[]>;
  findById(id: string): Promise<Trainer | null>;
  update(trainer: Trainer): Promise<void>;
  // Os Pokémons do treinador NÃO são apagados: ficam sem treinador (selvagens).
  // Se o id não existir, a implementação sinaliza (404 "não encontrado").
  delete(id: string): Promise<void>;
}
