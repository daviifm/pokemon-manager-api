// src/application/use-cases/update-pokemon.ts
import { Pokemon } from '@domain/entities/pokemon';
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';
import { ReplacePokemonDTO } from '@application/dtos/pokemon-dtos';
import { ensureTeamHasRoom } from './ensure-team-has-room';

export class UpdatePokemonUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(id: string, data: ReplacePokemonDTO): Promise<Pokemon> {
    const existing = await this.pokemonRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('Pokémon não encontrado');
    }

    // Mudou de treinador? Então o time de destino precisa ter vaga.
    if (data.trainerId && data.trainerId !== existing.trainerId) {
      await ensureTeamHasRoom(this.pokemonRepository, data.trainerId);
    }

    const updated = existing.with({
      level: data.level,
      trainerId: data.trainerId,
    });

    await this.pokemonRepository.update(updated);
    return updated;
  }
}
