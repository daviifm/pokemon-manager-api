// src/infrastructure/database/in-memory/in-memory-pokemon-repository.ts
import { Pokemon } from '@domain/entities/pokemon';
import {
  PaginatedResult,
  PokemonListFilters,
  PokemonRepository,
} from '@domain/repositories/pokemon-repository';

// Dublê de teste: sem banco, sem Docker.
export class InMemoryPokemonRepository implements PokemonRepository {
  private pokemons: Pokemon[] = [];

  async create(pokemon: Pokemon): Promise<void> {
    this.pokemons.push(pokemon);
  }

  async findAll(
    filters: PokemonListFilters,
  ): Promise<PaginatedResult<Pokemon>> {
    const filtered = this.pokemons
      .filter((p) => p.level >= filters.minLevel && p.level <= filters.maxLevel)
      .filter((p) => (filters.type ? p.types.includes(filters.type) : true))
      .filter((p) =>
        filters.trainerId ? p.trainerId === filters.trainerId : true,
      )
      .sort((a, b) => a.pokedexNumber - b.pokedexNumber); // sort é estável: mantém a ordem de cadastro

    const start = (filters.page - 1) * filters.limit;
    return {
      items: filtered.slice(start, start + filters.limit),
      total: filtered.length,
    };
  }

  async listAll(): Promise<Pokemon[]> {
    return [...this.pokemons].sort((a, b) => a.pokedexNumber - b.pokedexNumber);
  }

  async findById(id: string): Promise<Pokemon | null> {
    return this.pokemons.find((p) => p.id === id) ?? null;
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    const needle = term.toLowerCase();
    return this.pokemons.filter((p) => p.name.toLowerCase().includes(needle));
  }

  async countByTrainerId(trainerId: string): Promise<number> {
    return this.pokemons.filter((p) => p.trainerId === trainerId).length;
  }

  async update(pokemon: Pokemon): Promise<void> {
    const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
    if (index >= 0) this.pokemons[index] = pokemon;
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    const index = this.pokemons.findIndex((p) => p.id === id);
    if (index >= 0)
      this.pokemons[index] = this.pokemons[index].with({ level: newLevel });
  }

  async delete(id: string): Promise<void> {
    this.pokemons = this.pokemons.filter((p) => p.id !== id);
  }

  // Usado pelo InMemoryTrainerRepository: devolve os Pokémons do treinador à natureza.
  releaseAllFromTrainer(trainerId: string): void {
    this.pokemons = this.pokemons.map((p) =>
      p.trainerId === trainerId ? p.with({ trainerId: null }) : p,
    );
  }
}
