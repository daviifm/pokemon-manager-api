"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerRoutes = void 0;
// src/infrastructure/http/routes/trainer-routes.ts
const express_1 = require("express");
const make_trainer_controller_1 = require("../../../main/factories/make-trainer-controller.js");
const async_handler_1 = require("../middlewares/async-handler");
const validate_request_1 = require("../middlewares/validate-request");
const pokemon_schemas_1 = require("../schemas/pokemon-schemas");
const trainer_schemas_1 = require("../schemas/trainer-schemas");
const trainerRoutes = (0, express_1.Router)();
exports.trainerRoutes = trainerRoutes;
const controller = (0, make_trainer_controller_1.makeTrainerController)();
trainerRoutes.post('/', (0, validate_request_1.validateRequest)({ body: trainer_schemas_1.createTrainerSchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
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
}));
trainerRoutes.get('/', (0, async_handler_1.asyncHandler)(async (req, res) => {
    /*
    #swagger.auto = false
    #swagger.tags = ['Trainers']
    #swagger.summary = 'Lista treinadores'
    #swagger.responses[200] = { description: 'Lista de treinadores', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrainerListResponse' } } } }
  */
    return controller.list(req, res);
}));
trainerRoutes.get('/:id', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.idParamSchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
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
}));
trainerRoutes.patch('/:id', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.idParamSchema, body: trainer_schemas_1.updateTrainerSchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
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
}));
trainerRoutes.delete('/:id', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.idParamSchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
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
}));
