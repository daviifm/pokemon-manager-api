"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POKEMON_TYPES = void 0;
exports.isPokemonType = isPokemonType;
// src/domain/value-objects/pokemon-type.ts
// Os 18 tipos oficiais. É a "fonte da verdade": o Zod (infraestrutura) e a
// entidade Pokemon (domínio) usam esta mesma lista.
exports.POKEMON_TYPES = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
];
function isPokemonType(value) {
    return exports.POKEMON_TYPES.includes(value);
}
