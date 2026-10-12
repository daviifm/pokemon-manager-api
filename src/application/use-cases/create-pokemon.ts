// src/application/use-cases/create-pokemon.ts
import { Pokemon } from '@domain/entities/pokemon';
import { ConflictError } from '@domain/errors/conflict-error';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';
import { CreatePokemonDTO } from '@application/dtos/create-pokemon-dto';

export class CreatePokemonUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    // 1. A entidade valida as regras de domínio (nome, tipos, stats...).
    const pokemon = new Pokemon(data);

    // 2. Regra de negócio que depende do estado do sistema: id único.
    //    (O banco também garante via PRIMARY KEY: é a "segunda linha de defesa".)
    const alreadyExists = await this.pokemonRepository.findById(pokemon.id);
    if (alreadyExists) {
      throw new ConflictError(
        `Já existe um Pokémon cadastrado com o id ${pokemon.id}`,
      );
    }

    await this.pokemonRepository.create(pokemon);
    return pokemon;
  }
}
