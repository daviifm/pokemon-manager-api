"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = void 0;
class Pokemon {
    id;
    name;
    type;
    constructor(props) {
        if (!props.name || props.name.trim().length === 0) {
            throw new Error('O nome do Pokémon é obrigatório');
        }
        this.id = props.id;
        this.name = props.name;
        this.type = props.type;
    }
}
exports.Pokemon = Pokemon;
