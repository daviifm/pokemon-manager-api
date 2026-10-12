"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPokemonsUseCase = void 0;
class ListPokemonsUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute() {
        return this.repository.findAll();
    }
}
exports.ListPokemonsUseCase = ListPokemonsUseCase;
