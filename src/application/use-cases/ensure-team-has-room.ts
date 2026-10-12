// src/application/use-cases/ensure-team-has-room.ts
import { MAX_TEAM_SIZE } from '@domain/entities/trainer';
import { ConflictError } from '@domain/errors/conflict-error';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';

// Regra dos 6 Pokémons, compartilhada por quem adiciona alguém a um time
// (criar com trainerId, ou atribuir um Pokémon existente a um treinador).
export async function ensureTeamHasRoom(
  pokemonRepository: PokemonRepository,
  trainerId: string,
): Promise<void> {
  const teamSize = await pokemonRepository.countByTrainerId(trainerId);

  if (teamSize >= MAX_TEAM_SIZE) {
    throw new ConflictError(
      `O treinador já possui o limite máximo de ${MAX_TEAM_SIZE} Pokémons em seu time`,
    );
  }
}
