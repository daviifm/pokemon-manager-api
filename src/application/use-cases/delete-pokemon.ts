// src/application/use-cases/delete-pokemon.ts
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';

export class DeletePokemonUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(id: number): Promise<void> {
    const pokemon = await this.pokemonRepository.findById(id);

    if (!pokemon) {
      throw new NotFoundError(`Pokémon #${id}`);
    }

    await this.pokemonRepository.delete(id);
  }
}
