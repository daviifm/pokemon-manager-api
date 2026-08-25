import { Pokemon } from '@domain/entities/Pokemon';
import { PokemonRepository } from '@domain/repositories/PokemonRepository';

export class InMemoryPokemonRepository implements PokemonRepository {
  private pokemons: Pokemon[] = [];

  async save(pokemon: Pokemon): Promise<void> {
    this.pokemons.push(pokemon);
  }

  async findAll(): Promise<Pokemon[]> {
    return this.pokemons;
  }

  async findById(id: string): Promise<Pokemon | null> {
    return this.pokemons.find((p) => p.id === id) ?? null;
  }

  async update(pokemon: Pokemon): Promise<void> {
    const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
    if (index >= 0) this.pokemons[index] = pokemon;
  }

  async delete(id: string): Promise<void> {
    this.pokemons = this.pokemons.filter((p) => p.id !== id);
  }
}