// src/infrastructure/http/controllers/trainer-controller.ts
import { Request, Response } from 'express';
import { CreateTrainerUseCase } from '@application/use-cases/create-trainer';
import { DeleteTrainerUseCase } from '@application/use-cases/delete-trainer';
import { GetTrainerByIdUseCase } from '@application/use-cases/get-trainer-by-id';
import { ListTrainersUseCase } from '@application/use-cases/list-trainers';
import { UpdateTrainerUseCase } from '@application/use-cases/update-trainer';
import { presentTrainer } from './presenters';

export class TrainerController {
  constructor(
    private readonly createTrainer: CreateTrainerUseCase,
    private readonly listTrainers: ListTrainersUseCase,
    private readonly getById: GetTrainerByIdUseCase,
    private readonly updateTrainer: UpdateTrainerUseCase,
    private readonly deleteTrainer: DeleteTrainerUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const trainer = await this.createTrainer.execute(req.body);
    res.status(201).json({
      message: 'Treinador cadastrado com sucesso!',
      data: presentTrainer(trainer),
    });
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const trainers = await this.listTrainers.execute();
    res.status(200).json({ data: trainers.map(presentTrainer) });
  };

  show = async (req: Request, res: Response): Promise<void> => {
    const trainer = await this.getById.execute(String(req.params.id));
    res.status(200).json({ data: presentTrainer(trainer) });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const trainer = await this.updateTrainer.execute(
      String(req.params.id),
      req.body,
    );
    res.status(200).json({
      message: 'Treinador atualizado com sucesso!',
      data: presentTrainer(trainer),
    });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.deleteTrainer.execute(String(req.params.id));
    res.status(204).send();
  };
}
