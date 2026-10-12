// src/main/factories/make-trainer-controller.ts
import { CreateTrainerUseCase } from '@application/use-cases/create-trainer';
import { DeleteTrainerUseCase } from '@application/use-cases/delete-trainer';
import { GetTrainerByIdUseCase } from '@application/use-cases/get-trainer-by-id';
import { ListTrainersUseCase } from '@application/use-cases/list-trainers';
import { UpdateTrainerUseCase } from '@application/use-cases/update-trainer';
import { TrainerController } from '@infrastructure/http/controllers/trainer-controller';
import { makeRepositories } from './repositories';

export function makeTrainerController(): TrainerController {
  const { trainerRepository } = makeRepositories();

  return new TrainerController(
    new CreateTrainerUseCase(trainerRepository),
    new ListTrainersUseCase(trainerRepository),
    new GetTrainerByIdUseCase(trainerRepository),
    new UpdateTrainerUseCase(trainerRepository),
    new DeleteTrainerUseCase(trainerRepository),
  );
}
