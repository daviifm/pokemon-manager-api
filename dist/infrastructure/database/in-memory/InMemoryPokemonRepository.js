"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPokemonRepository = void 0;
class InMemoryPokemonRepository {
    pokemons = [];
    async save(pokemon) {
        this.pokemons.push(pokemon);
    }
    async findAll() {
        return this.pokemons;
    }
    async findById(id) {
        return this.pokemons.find((p) => p.id === id) ?? null;
    }
    async update(pokemon) {
        const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
        if (index >= 0)
            this.pokemons[index] = pokemon;
    }
    async delete(id) {
        this.pokemons = this.pokemons.filter((p) => p.id !== id);
    }
}
exports.InMemoryPokemonRepository = InMemoryPokemonRepository;
