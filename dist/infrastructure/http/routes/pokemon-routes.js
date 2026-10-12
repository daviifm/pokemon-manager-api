"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemonRoutes = void 0;
// src/infrastructure/http/routes/pokemon-routes.ts
const express_1 = require("express");
const make_pokemon_controller_1 = require("../../../main/factories/make-pokemon-controller.js");
const async_handler_1 = require("../middlewares/async-handler");
const validate_request_1 = require("../middlewares/validate-request");
const pokemon_schemas_1 = require("../schemas/pokemon-schemas");
const pokemonRoutes = (0, express_1.Router)();
exports.pokemonRoutes = pokemonRoutes;
const controller = (0, make_pokemon_controller_1.makePokemonController)();
// ATENÇÃO À ORDEM: rotas fixas (/stats, /search) vêm ANTES de /:id; senão o
// Express leria "stats" como se fosse um id.
pokemonRoutes.get('/stats', (0, async_handler_1.asyncHandler)(async (req, res) => {
    /*
    #swagger.auto = false
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Estatísticas do catálogo'
    #swagger.description = 'Total de Pokémons e contagem por tipo (tipo duplo conta nos dois tipos).'
    #swagger.responses[200] = { description: 'Estatísticas', content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonStats' } } } }
  */
    return controller.stats(req, res);
}));
pokemonRoutes.get('/search', (0, validate_request_1.validateRequest)({ query: pokemon_schemas_1.searchPokemonsQuerySchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Busca por nome (parcial)'
      #swagger.description = 'Busca parcial, sem diferenciar maiúsculas de minúsculas (ex: "pika" encontra "pikachu").'
      #swagger.parameters['name'] = { in: 'query', required: true, type: 'string', description: 'Trecho do nome', example: 'pika' }
      #swagger.responses[200] = { description: 'Pokémons encontrados', content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonListSimpleResponse' } } } }
      #swagger.responses[400] = { description: 'Parâmetro inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } }
    */
    return controller.search(req, res);
}));
pokemonRoutes.post('/', (0, validate_request_1.validateRequest)({ body: pokemon_schemas_1.createPokemonSchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Cadastra um Pokémon'
      #swagger.description = 'Informe só o nome da espécie e o nível. Tipos, status base, sprite, experiência, altura e peso são buscados na PokéAPI. Se trainerId for informado, vale a regra dos 6 Pokémons por time.'
      #swagger.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePokemon' } } } }
      #swagger.responses[201] = { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonCreatedResponse' } } } }
      #swagger.responses[400] = { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } }
      #swagger.responses[404] = { description: 'Espécie não existe na PokéAPI', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      #swagger.responses[409] = { description: 'Time do treinador já tem 6 Pokémons', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      #swagger.responses[503] = { description: 'PokéAPI indisponível', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
    */
    return controller.create(req, res);
}));
pokemonRoutes.get('/', (0, validate_request_1.validateRequest)({ query: pokemon_schemas_1.listPokemonsQuerySchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Lista Pokémons (filtros + paginação)'
      #swagger.parameters['type'] = { in: 'query', type: 'string', description: 'Filtra por tipo (ex: fire)' }
      #swagger.parameters['minLevel'] = { in: 'query', type: 'integer', description: 'Nível mínimo (padrão 1)' }
      #swagger.parameters['maxLevel'] = { in: 'query', type: 'integer', description: 'Nível máximo (padrão 100)' }
      #swagger.parameters['trainerId'] = { in: 'query', type: 'string', description: 'UUID do treinador' }
      #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Página (padrão 1)' }
      #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Itens por página (padrão 10, máximo 50)' }
      #swagger.responses[200] = { description: 'Página de Pokémons', content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonListResponse' } } } }
      #swagger.responses[400] = { description: 'Filtro inválido (ex: limit=mil, type=DIGIMON)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } }
    */
    return controller.list(req, res);
}));
pokemonRoutes.get('/:id', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.idParamSchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Busca um Pokémon pelo id'
      #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'UUID do Pokémon' }
      #swagger.responses[200] = { description: 'Pokémon', content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonResponse' } } } }
      #swagger.responses[400] = { description: 'Id malformado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } }
      #swagger.responses[404] = { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
    */
    return controller.show(req, res);
}));
pokemonRoutes.put('/:id', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.idParamSchema, body: pokemon_schemas_1.replacePokemonSchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Substitui nível e treinador (PUT)'
      #swagger.description = 'Substitui os campos editáveis. trainerId ausente ou null deixa o Pokémon selvagem. Trocar de treinador respeita a regra dos 6.'
      #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'UUID do Pokémon' }
      #swagger.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ReplacePokemon' } } } }
      #swagger.responses[200] = { description: 'Atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonCreatedResponse' } } } }
      #swagger.responses[400] = { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } }
      #swagger.responses[404] = { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
      #swagger.responses[409] = { description: 'Time do novo treinador está cheio', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
    */
    return controller.replace(req, res);
}));
pokemonRoutes.patch('/:id/level', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.idParamSchema, body: pokemon_schemas_1.updatePokemonLevelSchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Atualiza só o nível'
      #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'UUID do Pokémon' }
      #swagger.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PatchLevel' } } } }
      #swagger.responses[200] = { description: 'Nível atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonCreatedResponse' } } } }
      #swagger.responses[400] = { description: 'Nível inválido (1 a 100)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } }
      #swagger.responses[404] = { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
    */
    return controller.patchLevel(req, res);
}));
pokemonRoutes.delete('/:id', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.idParamSchema }), (0, async_handler_1.asyncHandler)(async (req, res) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Remove um Pokémon'
      #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'UUID do Pokémon' }
      #swagger.responses[204] = { description: 'Removido (sem corpo)' }
      #swagger.responses[404] = { description: 'Não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
    */
    return controller.remove(req, res);
}));
