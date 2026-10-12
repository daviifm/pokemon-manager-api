"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStats = void 0;
// src/domain/value-objects/base-stats.ts
const validation_error_1 = require("../errors/validation-error.js");
const STAT_LABELS = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    specialAttack: 'Sp. Attack',
    specialDefense: 'Sp. Defense',
    speed: 'Speed',
};
// Value Object: imutável e sem identidade própria (dois BaseStats com os mesmos
// valores são "iguais"). A regra de domínio: cada stat é um inteiro de 1 a 255
// (é o limite real dos jogos, onde o valor é guardado em 1 byte).
class BaseStats {
    hp;
    attack;
    defense;
    specialAttack;
    specialDefense;
    speed;
    constructor(props) {
        for (const key of Object.keys(STAT_LABELS)) {
            const value = props[key];
            if (!Number.isInteger(value) || value < 1 || value > 255) {
                throw new validation_error_1.ValidationError(`${STAT_LABELS[key]} deve ser um inteiro entre 1 e 255`);
            }
        }
        this.hp = props.hp;
        this.attack = props.attack;
        this.defense = props.defense;
        this.specialAttack = props.specialAttack;
        this.specialDefense = props.specialDefense;
        this.speed = props.speed;
    }
    // BST (Base Stat Total): a soma clássica usada no competitivo.
    get total() {
        return (this.hp +
            this.attack +
            this.defense +
            this.specialAttack +
            this.specialDefense +
            this.speed);
    }
    // Controla como o objeto vira JSON na resposta HTTP (getters não são
    // serializados sozinhos, então incluímos o `total` explicitamente).
    toJSON() {
        return {
            hp: this.hp,
            attack: this.attack,
            defense: this.defense,
            specialAttack: this.specialAttack,
            specialDefense: this.specialDefense,
            speed: this.speed,
            total: this.total,
        };
    }
}
exports.BaseStats = BaseStats;
