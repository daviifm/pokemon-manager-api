"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = exports.MAX_LEVEL = exports.MIN_LEVEL = void 0;
// src/domain/entities/pokemon.ts
const validation_error_1 = require("../errors/validation-error.js");
const base_stats_1 = require("../value-objects/base-stats.js");
const pokemon_type_1 = require("../value-objects/pokemon-type.js");
exports.MIN_LEVEL = 1;
exports.MAX_LEVEL = 100;
function assertOptionalNonNegativeInt(value, label) {
    if (value != null && (!Number.isInteger(value) || value < 0)) {
        throw new validation_error_1.ValidationError(`${label} deve ser um inteiro não negativo`);
    }
}
// Entidade imutável: para "alterar" um Pokémon criamos outro (passando de novo
// pelo construtor), o que garante que as regras abaixo valem SEMPRE.
class Pokemon {
    id;
    pokedexNumber;
    name;
    types;
    baseStats;
    level;
    trainerId;
    spriteUrl;
    baseExperience;
    height;
    weight;
    constructor(props) {
        if (!props.id?.trim()) {
            throw new validation_error_1.ValidationError('O id do Pokémon é obrigatório');
        }
        if (!Number.isInteger(props.pokedexNumber) || props.pokedexNumber < 1) {
            throw new validation_error_1.ValidationError('O número da Pokédex deve ser um inteiro positivo');
        }
        const name = props.name?.trim();
        if (!name) {
            throw new validation_error_1.ValidationError('O nome do Pokémon é obrigatório');
        }
        if (!Number.isInteger(props.level) ||
            props.level < exports.MIN_LEVEL ||
            props.level > exports.MAX_LEVEL) {
            throw new validation_error_1.ValidationError(`O nível deve ser um inteiro entre ${exports.MIN_LEVEL} e ${exports.MAX_LEVEL}`);
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
        assertOptionalNonNegativeInt(props.baseExperience, 'A experiência base');
        assertOptionalNonNegativeInt(props.height, 'A altura');
        assertOptionalNonNegativeInt(props.weight, 'O peso');
        this.id = props.id;
        this.pokedexNumber = props.pokedexNumber;
        this.name = name;
        this.types = types;
        this.baseStats = new base_stats_1.BaseStats(props.baseStats);
        this.level = props.level;
        this.trainerId = props.trainerId ?? null;
        this.spriteUrl = props.spriteUrl ?? null;
        this.baseExperience = props.baseExperience ?? null;
        this.height = props.height ?? null;
        this.weight = props.weight ?? null;
    }
    // Devolve uma NOVA instância com as mudanças (e revalida tudo no construtor).
    with(changes) {
        return new Pokemon({
            id: this.id,
            pokedexNumber: this.pokedexNumber,
            name: this.name,
            types: this.types,
            baseStats: this.baseStats,
            level: changes.level ?? this.level,
            trainerId: changes.trainerId === undefined ? this.trainerId : changes.trainerId,
            spriteUrl: this.spriteUrl,
            baseExperience: this.baseExperience,
            height: this.height,
            weight: this.weight,
        });
    }
}
exports.Pokemon = Pokemon;
