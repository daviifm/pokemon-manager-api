// src/application/use-cases/import-pokemon-from-pokeapi.ts
import { Pokemon } from '@domain/entities/pokemon';
import { ConflictError } from '@domain/errors/conflict-error';
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';

// Padrão BFF/agregador: o cliente só diz QUAL Pokémon quer (nome ou número da
// Pokédex) e o backend busca o resto na PokéAPI. Este Use Case não sabe que
// existe Axios, HTTP ou PokéAPI: só conhece o contrato do Gateway.
export class ImportPokemonFromPokeApiUseCase {
  constructor(
    private readonly pokemonRepository: PokemonRepository,
    private readonly pokemonGateway: PokemonExternalGateway,
  ) {}

  async execute(identifier: string | number): Promise<Pokemon> {
    const externalData = await this.pokemonGateway.findByIdOrName(identifier);

    if (!externalData) {
      throw new NotFoundError('Pokémon na PokéAPI');
    }

    const pokemon = new Pokemon(externalData);

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
