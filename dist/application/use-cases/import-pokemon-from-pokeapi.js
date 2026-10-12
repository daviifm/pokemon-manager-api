"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportPokemonFromPokeApiUseCase = void 0;
// src/application/use-cases/import-pokemon-from-pokeapi.ts
const pokemon_1 = require("@domain/entities/pokemon");
const conflict_error_1 = require("@domain/errors/conflict-error");
const not_found_error_1 = require("@domain/errors/not-found-error");
// Padrão BFF/agregador: o cliente só diz QUAL Pokémon quer (nome ou número da
// Pokédex) e o backend busca o resto na PokéAPI. Este Use Case não sabe que
// existe Axios, HTTP ou PokéAPI: só conhece o contrato do Gateway.
class ImportPokemonFromPokeApiUseCase {
    pokemonRepository;
    pokemonGateway;
    constructor(pokemonRepository, pokemonGateway) {
        this.pokemonRepository = pokemonRepository;
        this.pokemonGateway = pokemonGateway;
    }
    async execute(identifier) {
        const externalData = await this.pokemonGateway.findByIdOrName(identifier);
        if (!externalData) {
            throw new not_found_error_1.NotFoundError('Pokémon na PokéAPI');
        }
        const pokemon = new pokemon_1.Pokemon(externalData);
        const alreadyExists = await this.pokemonRepository.findById(pokemon.id);
        if (alreadyExists) {
            throw new conflict_error_1.ConflictError(`Já existe um Pokémon cadastrado com o id ${pokemon.id}`);
        }
        await this.pokemonRepository.create(pokemon);
        return pokemon;
    }
}
exports.ImportPokemonFromPokeApiUseCase = ImportPokemonFromPokeApiUseCase;
