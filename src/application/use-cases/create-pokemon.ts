// src/application/use-cases/create-pokemon.ts
import { randomUUID } from 'node:crypto'; // biblioteca padrão do Node (não é dependência externa)
import { Pokemon } from '@domain/entities/pokemon';
import { NotFoundError } from '@domain/errors/not-found-error';
import { ValidationError } from '@domain/errors/validation-error';
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';
import { CreatePokemonDTO } from '@application/dtos/pokemon-dtos';
import { ensureTeamHasRoom } from './ensure-team-has-room';

// O cliente informa só o nome (+ nível e, opcionalmente, o treinador). Sprite,
// tipos, status base, experiência, altura e peso vêm da PokéAPI via Gateway.
// Este Use Case não sabe que existe Axios, HTTP ou PokéAPI: só o contrato.
export class CreatePokemonUseCase {
  constructor(
    private readonly pokemonRepository: PokemonRepository,
    private readonly pokemonGateway: PokemonExternalGateway,
  ) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const details = await this.pokemonGateway.findByName(data.name);

    if (!details) {
      throw new NotFoundError(
        'Pokémon não encontrado na base oficial da PokeAPI',
      );
    }

    if (data.type && !details.types.includes(data.type)) {
      throw new ValidationError(
        `O Pokémon ${details.name} não possui o tipo "${data.type}" (tipos reais: ${details.types.join(', ')})`,
      );
    }

    // Regra dos 6. Repare que NÃO conferimos se o treinador existe aqui: se não
    // existir, quem barra é a chave estrangeira do banco (erro mapeado para 400).
    if (data.trainerId) {
      await ensureTeamHasRoom(this.pokemonRepository, data.trainerId);
    }

    const pokemon = new Pokemon({
      id: randomUUID(),
      pokedexNumber: details.pokedexNumber,
      name: details.name,
      types: details.types,
      baseStats: details.baseStats,
      level: data.level,
      trainerId: data.trainerId ?? null,
      spriteUrl: details.spriteUrl,
      baseExperience: details.baseExperience,
      height: details.height,
      weight: details.weight,
    });

    await this.pokemonRepository.create(pokemon);
    return pokemon;
  }
}
