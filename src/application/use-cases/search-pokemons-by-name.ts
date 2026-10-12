// src/application/use-cases/search-pokemons-by-name.ts
import { Pokemon } from '@domain/entities/pokemon';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';

export class SearchPokemonsByNameUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(term: string): Promise<Pokemon[]> {
    return this.pokemonRepository.searchByName(term);
  }
}
