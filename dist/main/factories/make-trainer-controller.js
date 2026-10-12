"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTrainerController = makeTrainerController;
// src/main/factories/make-trainer-controller.ts
const create_trainer_1 = require("../../application/use-cases/create-trainer.js");
const delete_trainer_1 = require("../../application/use-cases/delete-trainer.js");
const get_trainer_by_id_1 = require("../../application/use-cases/get-trainer-by-id.js");
const list_trainers_1 = require("../../application/use-cases/list-trainers.js");
const update_trainer_1 = require("../../application/use-cases/update-trainer.js");
const trainer_controller_1 = require("../../infrastructure/http/controllers/trainer-controller.js");
const repositories_1 = require("./repositories");
function makeTrainerController() {
    const { trainerRepository } = (0, repositories_1.makeRepositories)();
    return new trainer_controller_1.TrainerController(new create_trainer_1.CreateTrainerUseCase(trainerRepository), new list_trainers_1.ListTrainersUseCase(trainerRepository), new get_trainer_by_id_1.GetTrainerByIdUseCase(trainerRepository), new update_trainer_1.UpdateTrainerUseCase(trainerRepository), new delete_trainer_1.DeleteTrainerUseCase(trainerRepository));
}
