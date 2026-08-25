import { Pokemon } from '@domain/entities/Pokemon';
import { PokemonRepository } from '@domain/repositories/PokemonRepository';
import { CreatePokemonDTO } from '@application/dtos/CreatePokemonDTO';

export class CreatePokemonUseCase {
  constructor(private repository: PokemonRepository) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const pokemon = new Pokemon(data);
    await this.repository.save(pokemon);
    return pokemon;
  }
}