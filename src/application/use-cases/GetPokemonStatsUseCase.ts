import { PokemonRepository } from '@domain/repositories/PokemonRepository';

interface PokemonStats {
  totalPokemons: number;
  typesCount: Record<string, number>;
}

export class GetPokemonStatsUseCase {
  constructor(private repository: PokemonRepository) {}

  async execute(): Promise<PokemonStats> {
    const pokemons = await this.repository.findAll();
    const typesCount: Record<string, number> = {};

    for (const pokemon of pokemons) {
      typesCount[pokemon.type] = (typesCount[pokemon.type] ?? 0) + 1;
    }

    return { totalPokemons: pokemons.length, typesCount };
  }
}