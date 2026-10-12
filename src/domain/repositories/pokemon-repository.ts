// src/domain/repositories/pokemon-repository.ts
import { Pokemon } from '@domain/entities/pokemon';
import { PokemonType } from '@domain/value-objects/pokemon-type';

export interface PokemonFilters {
  type?: PokemonType;
}

// Contrato (porta) do domínio. Quem implementa (memória, Prisma...) fica na
// infraestrutura; os Use Cases só enxergam esta interface.
export interface PokemonRepository {
  create(pokemon: Pokemon): Promise<void>;
  findAll(filters?: PokemonFilters): Promise<Pokemon[]>;
  findById(id: number): Promise<Pokemon | null>;
  update(pokemon: Pokemon): Promise<void>;
  delete(id: number): Promise<void>;
}
