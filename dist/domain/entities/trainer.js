"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trainer = exports.MAX_TEAM_SIZE = void 0;
// src/domain/entities/trainer.ts
const validation_error_1 = require("../errors/validation-error.js");
// Regra de negócio do universo Pokémon: um treinador carrega no máximo 6 Pokémons.
exports.MAX_TEAM_SIZE = 6;
class Trainer {
    id;
    name;
    email;
    city;
    constructor(props) {
        if (!props.id?.trim()) {
            throw new validation_error_1.ValidationError('O id do treinador é obrigatório');
        }
        const name = props.name?.trim();
        if (!name) {
            throw new validation_error_1.ValidationError('O nome do treinador é obrigatório');
        }
        const email = props.email?.trim().toLowerCase();
        if (!email || !email.includes('@')) {
            throw new validation_error_1.ValidationError('O e-mail do treinador é inválido');
        }
        const city = props.city?.trim();
        if (!city) {
            throw new validation_error_1.ValidationError('A cidade do treinador é obrigatória');
        }
        this.id = props.id;
        this.name = name;
        this.email = email;
        this.city = city;
    }
}
exports.Trainer = Trainer;
