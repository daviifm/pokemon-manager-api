"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryTrainerRepository = void 0;
const conflict_error_1 = require("../../../domain/errors/conflict-error.js");
const not_found_error_1 = require("../../../domain/errors/not-found-error.js");
class InMemoryTrainerRepository {
    pokemonRepository;
    trainers = [];
    // Recebe o repositório de Pokémons para soltá-los ao remover o treinador.
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async create(trainer) {
        this.assertEmailIsFree(trainer);
        this.trainers.push(trainer);
    }
    async findAll() {
        return [...this.trainers];
    }
    async findById(id) {
        return this.trainers.find((t) => t.id === id) ?? null;
    }
    async update(trainer) {
        this.assertEmailIsFree(trainer);
        const index = this.trainers.findIndex((t) => t.id === trainer.id);
        if (index >= 0)
            this.trainers[index] = trainer;
    }
    async delete(id) {
        if (!this.trainers.some((t) => t.id === id)) {
            throw new not_found_error_1.NotFoundError('Treinador não encontrado no banco de dados');
        }
        this.pokemonRepository.releaseAllFromTrainer(id);
        this.trainers = this.trainers.filter((t) => t.id !== id);
    }
    assertEmailIsFree(trainer) {
        if (this.trainers.some((t) => t.email === trainer.email && t.id !== trainer.id)) {
            throw new conflict_error_1.ConflictError('Já existe um Treinador cadastrado com este e-mail.');
        }
    }
}
exports.InMemoryTrainerRepository = InMemoryTrainerRepository;
