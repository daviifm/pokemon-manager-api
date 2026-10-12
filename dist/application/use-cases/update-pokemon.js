"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePokemonUseCase = void 0;
// src/application/use-cases/update-pokemon.ts
const pokemon_1 = require("@domain/entities/pokemon");
const not_found_error_1 = require("@domain/errors/not-found-error");
class UpdatePokemonUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(id, data) {
        const existing = await this.pokemonRepository.findById(id);
        if (!existing) {
            throw new not_found_error_1.NotFoundError(`Pokémon #${id}`);
        }
        // Mescla o que já existe com o que chegou. Criar uma NOVA entidade (em vez
        // de mutar a antiga) faz o construtor revalidar todas as regras de domínio.
        const updated = new pokemon_1.Pokemon({
            id: existing.id,
            name: data.name ?? existing.name,
            types: data.types ?? existing.types,
            baseStats: data.baseStats ?? existing.baseStats,
            spriteUrl: data.spriteUrl === undefined ? existing.spriteUrl : data.spriteUrl,
        });
        await this.pokemonRepository.update(updated);
        return updated;
    }
}
exports.UpdatePokemonUseCase = UpdatePokemonUseCase;
