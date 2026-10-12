// src/infrastructure/database/in-memory/in-memory-pokemon-repository.ts
import { Pokemon } from '@domain/entities/pokemon';
import {
  PokemonFilters,
  PokemonRepository,
} from '@domain/repositories/pokemon-repository';

// Mantido do Módulo 1: agora serve como "dublê" de teste (sem banco, sem Docker).
export class InMemoryPokemonRepository implements PokemonRepository {
  private pokemons: Pokemon[] = [];

  async create(pokemon: Pokemon): Promise<void> {
    this.pokemons.push(pokemon);
  }

  async findAll(filters?: PokemonFilters): Promise<Pokemon[]> {
    const result = filters?.type
      ? this.pokemons.filter((pokemon) => pokemon.types.includes(filters.type!))
      : this.pokemons;

    return [...result].sort((a, b) => a.id - b.id);
  }

  async findById(id: number): Promise<Pokemon | null> {
    return this.pokemons.find((pokemon) => pokemon.id === id) ?? null;
  }

  async update(pokemon: Pokemon): Promise<void> {
    const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
    if (index >= 0) this.pokemons[index] = pokemon;
  }

  async delete(id: number): Promise<void> {
    this.pokemons = this.pokemons.filter((pokemon) => pokemon.id !== id);
  }
}
