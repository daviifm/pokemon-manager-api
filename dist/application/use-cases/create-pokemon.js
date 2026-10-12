"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePokemonUseCase = void 0;
// src/application/use-cases/create-pokemon.ts
const node_crypto_1 = require("node:crypto"); // biblioteca padrão do Node (não é dependência externa)
const pokemon_1 = require("../../domain/entities/pokemon.js");
const not_found_error_1 = require("../../domain/errors/not-found-error.js");
const validation_error_1 = require("../../domain/errors/validation-error.js");
const ensure_team_has_room_1 = require("./ensure-team-has-room");
// O cliente informa só o nome (+ nível e, opcionalmente, o treinador). Sprite,
// tipos, status base, experiência, altura e peso vêm da PokéAPI via Gateway.
// Este Use Case não sabe que existe Axios, HTTP ou PokéAPI: só o contrato.
class CreatePokemonUseCase {
    pokemonRepository;
    pokemonGateway;
    constructor(pokemonRepository, pokemonGateway) {
        this.pokemonRepository = pokemonRepository;
        this.pokemonGateway = pokemonGateway;
    }
    async execute(data) {
        const details = await this.pokemonGateway.findByName(data.name);
        if (!details) {
            throw new not_found_error_1.NotFoundError('Pokémon não encontrado na base oficial da PokeAPI');
        }
        if (data.type && !details.types.includes(data.type)) {
            throw new validation_error_1.ValidationError(`O Pokémon ${details.name} não possui o tipo "${data.type}" (tipos reais: ${details.types.join(', ')})`);
        }
        // Regra dos 6. Repare que NÃO conferimos se o treinador existe aqui: se não
        // existir, quem barra é a chave estrangeira do banco (erro mapeado para 400).
        if (data.trainerId) {
            await (0, ensure_team_has_room_1.ensureTeamHasRoom)(this.pokemonRepository, data.trainerId);
        }
        const pokemon = new pokemon_1.Pokemon({
            id: (0, node_crypto_1.randomUUID)(),
            pokedexNumber: details.pokedexNumber,
            name: details.name,
            types: details.types,
            baseStats: details.baseStats,
            level: data.level,
            trainerId: data.trainerId ?? null,
            spriteUrl: details.spriteUrl,
            baseExperience: details.baseExperience,
            height: details.height,
            weight: details.weight,
        });
        await this.pokemonRepository.create(pokemon);
        return pokemon;
    }
}
exports.CreatePokemonUseCase = CreatePokemonUseCase;
