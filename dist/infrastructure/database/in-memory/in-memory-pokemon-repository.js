"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPokemonRepository = void 0;
// Dublê de teste: sem banco, sem Docker.
class InMemoryPokemonRepository {
    pokemons = [];
    async create(pokemon) {
        this.pokemons.push(pokemon);
    }
    async findAll(filters) {
        const filtered = this.pokemons
            .filter((p) => p.level >= filters.minLevel && p.level <= filters.maxLevel)
            .filter((p) => (filters.type ? p.types.includes(filters.type) : true))
            .filter((p) => filters.trainerId ? p.trainerId === filters.trainerId : true)
            .sort((a, b) => a.pokedexNumber - b.pokedexNumber); // sort é estável: mantém a ordem de cadastro
        const start = (filters.page - 1) * filters.limit;
        return {
            items: filtered.slice(start, start + filters.limit),
            total: filtered.length,
        };
    }
    async listAll() {
        return [...this.pokemons].sort((a, b) => a.pokedexNumber - b.pokedexNumber);
    }
    async findById(id) {
        return this.pokemons.find((p) => p.id === id) ?? null;
    }
    async searchByName(term) {
        const needle = term.toLowerCase();
        return this.pokemons.filter((p) => p.name.toLowerCase().includes(needle));
    }
    async countByTrainerId(trainerId) {
        return this.pokemons.filter((p) => p.trainerId === trainerId).length;
    }
    async update(pokemon) {
        const index = this.pokemons.findIndex((p) => p.id === pokemon.id);
        if (index >= 0)
            this.pokemons[index] = pokemon;
    }
    async updateLevel(id, newLevel) {
        const index = this.pokemons.findIndex((p) => p.id === id);
        if (index >= 0)
            this.pokemons[index] = this.pokemons[index].with({ level: newLevel });
    }
    async delete(id) {
        this.pokemons = this.pokemons.filter((p) => p.id !== id);
    }
    // Usado pelo InMemoryTrainerRepository: devolve os Pokémons do treinador à natureza.
    releaseAllFromTrainer(trainerId) {
        this.pokemons = this.pokemons.map((p) => p.trainerId === trainerId ? p.with({ trainerId: null }) : p);
    }
}
exports.InMemoryPokemonRepository = InMemoryPokemonRepository;
