"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = void 0;
// src/domain/entities/pokemon.ts
const validation_error_1 = require("@domain/errors/validation-error");
const base_stats_1 = require("@domain/value-objects/base-stats");
const pokemon_type_1 = require("@domain/value-objects/pokemon-type");
// Entidade imutável: para "alterar" um Pokémon criamos outro (passando de novo
// pelo construtor), o que garante que as regras abaixo valem SEMPRE.
class Pokemon {
    id;
    name;
    types;
    baseStats;
    spriteUrl;
    constructor(props) {
        if (!Number.isInteger(props.id) || props.id < 1) {
            throw new validation_error_1.ValidationError('O id do Pokémon deve ser um inteiro positivo');
        }
        const name = props.name?.trim();
        if (!name) {
            throw new validation_error_1.ValidationError('O nome do Pokémon é obrigatório');
        }
        if (props.types.length < 1 || props.types.length > 2) {
            throw new validation_error_1.ValidationError('Um Pokémon deve ter 1 ou 2 tipos');
        }
        if (new Set(props.types).size !== props.types.length) {
            throw new validation_error_1.ValidationError('Os tipos de um Pokémon não podem se repetir');
        }
        const types = [];
        for (const type of props.types) {
            if (!(0, pokemon_type_1.isPokemonType)(type)) {
                throw new validation_error_1.ValidationError(`Tipo inválido: "${type}"`);
            }
            types.push(type);
        }
        this.id = props.id;
        this.name = name;
        this.types = types;
        this.baseStats = new base_stats_1.BaseStats(props.baseStats);
        this.spriteUrl = props.spriteUrl ?? null;
    }
}
exports.Pokemon = Pokemon;
