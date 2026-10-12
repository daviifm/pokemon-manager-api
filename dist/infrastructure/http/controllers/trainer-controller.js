"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerController = void 0;
const presenters_1 = require("./presenters");
class TrainerController {
    createTrainer;
    listTrainers;
    getById;
    updateTrainer;
    deleteTrainer;
    constructor(createTrainer, listTrainers, getById, updateTrainer, deleteTrainer) {
        this.createTrainer = createTrainer;
        this.listTrainers = listTrainers;
        this.getById = getById;
        this.updateTrainer = updateTrainer;
        this.deleteTrainer = deleteTrainer;
    }
    create = async (req, res) => {
        const trainer = await this.createTrainer.execute(req.body);
        res.status(201).json({
            message: 'Treinador cadastrado com sucesso!',
            data: (0, presenters_1.presentTrainer)(trainer),
        });
    };
    list = async (_req, res) => {
        const trainers = await this.listTrainers.execute();
        res.status(200).json({ data: trainers.map(presenters_1.presentTrainer) });
    };
    show = async (req, res) => {
        const trainer = await this.getById.execute(String(req.params.id));
        res.status(200).json({ data: (0, presenters_1.presentTrainer)(trainer) });
    };
    update = async (req, res) => {
        const trainer = await this.updateTrainer.execute(String(req.params.id), req.body);
        res.status(200).json({
            message: 'Treinador atualizado com sucesso!',
            data: (0, presenters_1.presentTrainer)(trainer),
        });
    };
    remove = async (req, res) => {
        await this.deleteTrainer.execute(String(req.params.id));
        res.status(204).send();
    };
}
exports.TrainerController = TrainerController;
