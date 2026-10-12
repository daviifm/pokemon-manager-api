"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPokemonRepository = void 0;
// Mantido do Módulo 1: agora serve como "dublê" de teste (sem banco, sem Docker).
class InMemoryPokemonRepository {
    pokemons = [];
    async create(pokemon) {
        this.pokemons.push(pokemon);
    }
    async findAll(filters) {
        const result = filters?.type
            ? this.pokemons.filter((pokemon) => pokemon.types.includes(filters.type))
            : this.pokemons;
        return [...result].sort((a, b) => a.id - b.id);
    }
    async findById(id) {
        return this.pokemons.find((pokemon) => pokemon.id === id) ?? null;
    }
    async update(pokemon) {
        const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
        if (index >= 0)
            this.pokemons[index] = pokemon;
    }
    async delete(id) {
        this.pokemons = this.pokemons.filter((pokemon) => pokemon.id !== id);
    }
}
exports.InMemoryPokemonRepository = InMemoryPokemonRepository;
