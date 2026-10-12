"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePokemonUseCase = void 0;
// src/application/use-cases/create-pokemon.ts
const pokemon_1 = require("@domain/entities/pokemon");
const conflict_error_1 = require("@domain/errors/conflict-error");
class CreatePokemonUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(data) {
        // 1. A entidade valida as regras de domínio (nome, tipos, stats...).
        const pokemon = new pokemon_1.Pokemon(data);
        // 2. Regra de negócio que depende do estado do sistema: id único.
        //    (O banco também garante via PRIMARY KEY: é a "segunda linha de defesa".)
        const alreadyExists = await this.pokemonRepository.findById(pokemon.id);
        if (alreadyExists) {
            throw new conflict_error_1.ConflictError(`Já existe um Pokémon cadastrado com o id ${pokemon.id}`);
        }
        await this.pokemonRepository.create(pokemon);
        return pokemon;
    }
}
exports.CreatePokemonUseCase = CreatePokemonUseCase;
