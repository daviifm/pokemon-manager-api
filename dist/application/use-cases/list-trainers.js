"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTrainersUseCase = void 0;
class ListTrainersUseCase {
    trainerRepository;
    constructor(trainerRepository) {
        this.trainerRepository = trainerRepository;
    }
    async execute() {
        return this.trainerRepository.findAll();
    }
}
exports.ListTrainersUseCase = ListTrainersUseCase;
