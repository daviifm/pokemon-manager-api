// src/application/use-cases/update-pokemon.ts
import { Pokemon } from '@domain/entities/pokemon';
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';
import { UpdatePokemonDTO } from '@application/dtos/update-pokemon-dto';

export class UpdatePokemonUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(id: number, data: UpdatePokemonDTO): Promise<Pokemon> {
    const existing = await this.pokemonRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Pokémon #${id}`);
    }

    // Mescla o que já existe com o que chegou. Criar uma NOVA entidade (em vez
    // de mutar a antiga) faz o construtor revalidar todas as regras de domínio.
    const updated = new Pokemon({
      id: existing.id,
      name: data.name ?? existing.name,
      types: data.types ?? existing.types,
      baseStats: data.baseStats ?? existing.baseStats,
      spriteUrl:
        data.spriteUrl === undefined ? existing.spriteUrl : data.spriteUrl,
    });

    await this.pokemonRepository.update(updated);
    return updated;
  }
}
