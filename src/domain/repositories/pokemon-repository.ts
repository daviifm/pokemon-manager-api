// src/domain/repositories/pokemon-repository.ts
import { Pokemon } from '@domain/entities/pokemon';
import { PokemonType } from '@domain/value-objects/pokemon-type';

export interface PokemonListFilters {
  type?: PokemonType;
  minLevel: number;
  maxLevel: number;
  trainerId?: string;
  page: number; // começa em 1
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number; // total de registros que casam com os filtros (ignorando a paginação)
}

// Contrato (porta) do domínio. Quem implementa (memória, pg, Prisma...) fica na
// infraestrutura; os Use Cases só enxergam esta interface.
export interface PokemonRepository {
  create(pokemon: Pokemon): Promise<void>;
  findAll(filters: PokemonListFilters): Promise<PaginatedResult<Pokemon>>;
  listAll(): Promise<Pokemon[]>; // sem paginação (usado nas estatísticas)
  findById(id: string): Promise<Pokemon | null>;
  searchByName(term: string): Promise<Pokemon[]>; // busca parcial, ignorando maiúsculas
  countByTrainerId(trainerId: string): Promise<number>;
  update(pokemon: Pokemon): Promise<void>;
  updateLevel(id: string, newLevel: number): Promise<void>;
  delete(id: string): Promise<void>;
}
