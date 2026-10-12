"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presentTrainer = exports.presentPokemon = void 0;
// Presenters: traduzem entidades do domínio para o JSON da API. Necessário porque
// o `total` (BST) é um getter da classe e o JSON.stringify não o enxergaria.
const presentPokemon = (p) => ({
    id: p.id,
    pokedexNumber: p.pokedexNumber,
    name: p.name,
    types: [...p.types],
    level: p.level,
    baseStats: {
        hp: p.baseStats.hp,
        attack: p.baseStats.attack,
        defense: p.baseStats.defense,
        specialAttack: p.baseStats.specialAttack,
        specialDefense: p.baseStats.specialDefense,
        speed: p.baseStats.speed,
        total: p.baseStats.total,
    },
    trainerId: p.trainerId,
    spriteUrl: p.spriteUrl,
    baseExperience: p.baseExperience,
    height: p.height,
    weight: p.weight,
});
exports.presentPokemon = presentPokemon;
const presentTrainer = (t) => ({
    id: t.id,
    name: t.name,
    email: t.email,
    city: t.city,
});
exports.presentTrainer = presentTrainer;
