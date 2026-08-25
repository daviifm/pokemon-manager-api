import { Pokemon } from '@domain/entities/Pokemon';
import { PokemonRepository } from '@domain/repositories/PokemonRepository';

export class ListPokemonsUseCase {
  constructor(private repository: PokemonRepository) {}

  async execute(): Promise<Pokemon[]> {
    return this.repository.findAll();
  }
}