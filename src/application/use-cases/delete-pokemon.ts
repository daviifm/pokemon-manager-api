// src/application/use-cases/delete-pokemon.ts
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';

export class DeletePokemonUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(id: string): Promise<void> {
    const pokemon = await this.pokemonRepository.findById(id);

    if (!pokemon) {
      throw new NotFoundError('Pokémon não encontrado');
    }

    await this.pokemonRepository.delete(id);
  }
}
