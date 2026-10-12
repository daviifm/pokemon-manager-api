// src/application/use-cases/list-pokemons.ts
import { Pokemon } from '@domain/entities/pokemon';
import {
  PokemonListFilters,
  PokemonRepository,
} from '@domain/repositories/pokemon-repository';

export interface PaginatedPokemons {
  data: Pokemon[];
  meta: { page: number; limit: number; total: number };
}

export class ListPokemonsUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(filters: PokemonListFilters): Promise<PaginatedPokemons> {
    const { items, total } = await this.pokemonRepository.findAll(filters);

    return {
      data: items,
      meta: { page: filters.page, limit: filters.limit, total },
    };
  }
}
