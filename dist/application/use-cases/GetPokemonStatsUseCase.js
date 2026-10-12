"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPokemonStatsUseCase = void 0;
class GetPokemonStatsUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute() {
        const pokemons = await this.repository.findAll();
        const typesCount = {};
        for (const pokemon of pokemons) {
            typesCount[pokemon.type] = (typesCount[pokemon.type] ?? 0) + 1;
        }
        return { totalPokemons: pokemons.length, typesCount };
    }
}
exports.GetPokemonStatsUseCase = GetPokemonStatsUseCase;
