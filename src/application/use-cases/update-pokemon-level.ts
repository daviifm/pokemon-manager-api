// src/application/use-cases/update-pokemon-level.ts
import { Pokemon } from '@domain/entities/pokemon';
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonRepository } from '@domain/repositories/pokemon-repository';

export class UpdatePokemonLevelUseCase {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(id: string, newLevel: number): Promise<Pokemon> {
    const existing = await this.pokemonRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('Pokémon não encontrado');
    }

    // Revalida a regra do nível (1 a 100) no domínio antes de tocar no banco
    const updated = existing.with({ level: newLevel });

    await this.pokemonRepository.updateLevel(id, updated.level);
    return updated;
  }
}
