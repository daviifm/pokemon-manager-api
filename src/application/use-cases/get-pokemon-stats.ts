// src/application/use-cases/get-pokemon-stats.ts
import { PokemonRepository } from '@domain/repositories/pokemon-repository';

export interface PokemonCatalogStats {
  totalPokemons: number;
  typesCount: Record<string, number>;
}

export class GetPokemonStatsUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(): Promise<PokemonCatalogStats> {
    const pokemons = await this.pokemonRepository.listAll();
    const typesCount: Record<string, number> = {};

    for (const pokemon of pokemons) {
      // Um Pokémon de tipo duplo (ex: Bulbasaur) conta em AMBOS os baldes.
      for (const type of pokemon.types) {
        typesCount[type] = (typesCount[type] ?? 0) + 1;
      }
    }

    return { totalPokemons: pokemons.length, typesCount };
  }
}
