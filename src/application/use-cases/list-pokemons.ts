// src/application/use-cases/list-pokemons.ts
import { Pokemon } from '@domain/entities/pokemon';
import {
  PokemonFilters,
  PokemonRepository,
} from '@domain/repositories/pokemon-repository';

export class ListPokemonsUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(filters?: PokemonFilters): Promise<Pokemon[]> {
    return this.pokemonRepository.findAll(filters);
  }
}
