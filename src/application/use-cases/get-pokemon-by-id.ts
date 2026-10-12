// src/application/use-cases/get-pokemon-by-id.ts
import { Pokemon } from '@domain/entities/pokemon';
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';

export class GetPokemonByIdUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findById(id);

    if (!pokemon) {
      throw new NotFoundError('Pokémon não encontrado');
    }

    return pokemon;
  }
}
