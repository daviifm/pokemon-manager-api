import { Pokemon } from '@domain/entities/Pokemon';
import { PokemonRepository } from '@domain/repositories/PokemonRepository';
import { PokemonNotFoundError } from '@domain/errors/PokemonNotFoundError';
import { UpdatePokemonDTO } from '@application/dtos/UpdatePokemonDTO';

export class UpdatePokemonUseCase {
  constructor(private repository: PokemonRepository) {}

  async execute(id: string, data: UpdatePokemonDTO): Promise<Pokemon> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new PokemonNotFoundError(id);

    const updated = new Pokemon({
      id: existing.id,
      name: data.name ?? existing.name,
      type: data.type ?? existing.type,
    });
    await this.repository.update(updated);
    return updated;
  }
}