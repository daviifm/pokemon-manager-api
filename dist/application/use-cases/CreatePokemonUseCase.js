"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePokemonUseCase = void 0;
const Pokemon_1 = require("../../domain/entities/Pokemon.js");
class CreatePokemonUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(data) {
        const pokemon = new Pokemon_1.Pokemon(data);
        await this.repository.save(pokemon);
        return pokemon;
    }
}
exports.CreatePokemonUseCase = CreatePokemonUseCase;
