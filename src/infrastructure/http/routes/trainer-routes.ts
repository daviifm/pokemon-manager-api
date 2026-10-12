// src/infrastructure/http/routes/trainer-routes.ts
import { Router } from 'express';
import { makeTrainerController } from '@main/factories/make-trainer-controller';
import { asyncHandler } from '../middlewares/async-handler';
import { validateRequest } from '../middlewares/validate-request';
import { idParamSchema } from '../schemas/pokemon-schemas';
import {
  createTrainerSchema,
  updateTrainerSchema,
} from '../schemas/trainer-schemas';

const trainerRoutes = Router();
const controller = makeTrainerController();

trainerRoutes.post(
  '/',
  validateRequest({ body: createTrainerSchema }),
  asyncHandler(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Cadastra um treinador'
      #swagger.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTrainer' } } } }
      #swagger.responses[201] = { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainerCreatedResponse' } } } }
      #swagger.responses[400] = { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } }
      #swagger.responses[409] = { description: 'E-mail já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
    */
    return controller.create(req, res);
  }),
);

trainerRoutes.get(
  '/',
  asyncHandler(async (req, res) => {
    /*
    #swagger.auto = false
    #swagger.tags = ['Trainers']
    #swagger.summary = 'Lista treinadores'
    #swagger.responses[200] = { description: 'Lista de treinadores', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainerListResponse' } } } }
  */
    return controller.list(req, res);
  }),
);

trainerRoutes.get(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Busca um treinador pelo id'
      #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'UUID do treinador' }
      #swagger.responses[200] = { description: 'Treinador', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainerCreatedResponse' } } } }
      #swagger.responses[400] = { description: 'Id malformado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } }
      #swagger.responses[404] = { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
    */
    return controller.show(req, res);
  }),
);

trainerRoutes.patch(
  '/:id',
  validateRequest({ params: idParamSchema, body: updateTrainerSchema }),
  asyncHandler(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Atualiza parcialmente um treinador'
      #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'UUID do treinador' }
      #swagger.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTrainer' } } } }
      #swagger.responses[200] = { description: 'Atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainerCreatedResponse' } } } }
      #swagger.responses[400] = { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } }
      #swagger.responses[404] = { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      #swagger.responses[409] = { description: 'E-mail já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
    */
    return controller.update(req, res);
  }),
);

trainerRoutes.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  asyncHandler(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Remove um treinador'
      #swagger.description = 'Os Pokémons do treinador NÃO são apagados: ficam selvagens (trainerId = null).'
      #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'UUID do treinador' }
      #swagger.responses[204] = { description: 'Removido (sem corpo)' }
      #swagger.responses[404] = { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
    */
    return controller.remove(req, res);
  }),
);

export { trainerRoutes };
