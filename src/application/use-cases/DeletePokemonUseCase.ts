import { PokemonRepository } from '@domain/repositories/PokemonRepository';
import { PokemonNotFoundError } from '@domain/errors/PokemonNotFoundError';

export class DeletePokemonUseCase {
  constructor(private repository: PokemonRepository) {}

  async execute(id: string): Promise<void> {
    const pokemon = await this.repository.findById(id);
    if (!pokemon) throw new PokemonNotFoundError(id);
    await this.repository.delete(id);
  }
}