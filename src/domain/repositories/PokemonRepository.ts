import { Pokemon } from '@domain/entities/Pokemon';

export interface PokemonRepository {
  save(pokemon: Pokemon): Promise<void>;
  findAll(): Promise<Pokemon[]>;
  findById(id: string): Promise<Pokemon | null>;
  update(pokemon: Pokemon): Promise<void>;
  delete(id: string): Promise<void>;
}