"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemonRoutes = void 0;
// src/infrastructure/http/routes/pokemon-routes.ts
const express_1 = require("express");
const validate_request_1 = require("@infrastructure/http/middlewares/validate-request");
const pokemon_schemas_1 = require("@infrastructure/http/schemas/pokemon-schemas");
const make_pokemon_controller_1 = require("@main/factories/make-pokemon-controller");
const pokemonRoutes = (0, express_1.Router)();
exports.pokemonRoutes = pokemonRoutes;
const pokemonController = (0, make_pokemon_controller_1.makePokemonController)();
// ⚠️ ORDEM IMPORTA: rotas fixas (/stats, /import) ANTES das dinâmicas (/:id).
// O Express usa a primeira rota que casar, e "stats" casaria com /:id.
pokemonRoutes.get('/stats', (req, res, next) => {
    /*
      #swagger.auto = false
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Estatísticas gerais do catálogo'
      #swagger.description = 'Retorna o total de Pokémons e a contagem por tipo. Pokémons de tipo duplo contam em ambos os tipos.'
      #swagger.responses[200] = {
        description: 'Estatísticas acumuladas',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonStats' } } }
      }
    */
    return pokemonController.stats(req, res, next);
});
pokemonRoutes.post('/import', (0, validate_request_1.validateRequest)({ body: pokemon_schemas_1.importPokemonSchema }), (req, res, next) => {
    /*
    #swagger.auto = false
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Importa um Pokémon da PokéAPI'
    #swagger.description = 'Busca o Pokémon na PokéAPI (por nome ou número da Pokédex) e o cadastra com tipos, status base e sprite. O id salvo é o número da Pokédex.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ImportPokemon' } } }
    }
    #swagger.responses[201] = {
      description: 'Pokémon importado com sucesso',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonCreatedResponse' } } }
    }
    #swagger.responses[400] = {
      description: 'Dados de entrada inválidos',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não existe na PokéAPI',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
    }
    #swagger.responses[409] = {
      description: 'Já existe um Pokémon cadastrado com esse id',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
    }
    #swagger.responses[503] = {
      description: 'PokéAPI indisponível (timeout, falha de rede ou circuit breaker aberto)',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
    }
  */
    return pokemonController.import(req, res, next);
});
pokemonRoutes.post('/', (0, validate_request_1.validateRequest)({ body: pokemon_schemas_1.createPokemonSchema }), (req, res, next) => {
    /*
    #swagger.auto = false
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Cadastra um novo Pokémon'
    #swagger.description = 'Cadastro manual. O id é o número da Pokédex e deve ser único.'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePokemon' } } }
    }
    #swagger.responses[201] = {
      description: 'Pokémon criado com sucesso',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/PokemonCreatedResponse' } } }
    }
    #swagger.responses[400] = {
      description: 'Dados de entrada inválidos',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } }
    }
    #swagger.responses[409] = {
      description: 'Já existe um Pokémon cadastrado com esse id',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
    }
  */
    return pokemonController.create(req, res, next);
});
pokemonRoutes.get('/', (0, validate_request_1.validateRequest)({ query: pokemon_schemas_1.listPokemonsQuerySchema }), (req, res, next) => {
    /*
    #swagger.auto = false
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Lista os Pokémons'
    #swagger.description = 'Lista todos os Pokémons ordenados pelo número da Pokédex. Aceita filtro opcional por tipo.'
    #swagger.parameters['type'] = {
      in: 'query',
      description: 'Filtra por tipo (ex: grass, fire, water)',
      required: false,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Lista de Pokémons',
      content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Pokemon' } } } }
    }
    #swagger.responses[400] = {
      description: 'Filtro inválido',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } }
    }
  */
    return pokemonController.list(req, res, next);
});
pokemonRoutes.get('/:id', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.pokemonIdParamsSchema }), (req, res, next) => {
    /*
    #swagger.auto = false
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Busca um Pokémon pelo número da Pokédex'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'Número da Pokédex (ex: 25)' }
    #swagger.responses[200] = {
      description: 'Pokémon encontrado',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Pokemon' } } }
    }
    #swagger.responses[400] = {
      description: 'Id inválido',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
    }
  */
    return pokemonController.getById(req, res, next);
});
pokemonRoutes.put('/:id', (0, validate_request_1.validateRequest)({
    params: pokemon_schemas_1.pokemonIdParamsSchema,
    body: pokemon_schemas_1.replacePokemonSchema,
}), (req, res, next) => {
    /*
      #swagger.auto = false
    #swagger.tags = ['Pokemons']
      #swagger.summary = 'Substitui um Pokémon (atualização completa)'
      #swagger.description = 'PUT substitui o recurso inteiro: todos os campos (exceto o id) são obrigatórios. Para alterar só alguns campos, use PATCH.'
      #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'Número da Pokédex do Pokémon a ser substituído' }
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ReplacePokemon' } } }
      }
      #swagger.responses[200] = {
        description: 'Pokémon atualizado com sucesso',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Pokemon' } } }
      }
      #swagger.responses[400] = {
        description: 'Dados de entrada inválidos',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } }
      }
      #swagger.responses[404] = {
        description: 'Pokémon não encontrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
      }
    */
    return pokemonController.replace(req, res, next);
});
pokemonRoutes.patch('/:id', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.pokemonIdParamsSchema, body: pokemon_schemas_1.patchPokemonSchema }), (req, res, next) => {
    /*
      #swagger.auto = false
    #swagger.tags = ['Pokemons']
      #swagger.summary = 'Atualiza parcialmente um Pokémon'
      #swagger.description = 'PATCH altera apenas os campos enviados (ao menos um).'
      #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'Número da Pokédex do Pokémon a ser atualizado' }
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/PatchPokemon' } } }
      }
      #swagger.responses[200] = {
        description: 'Pokémon atualizado com sucesso',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Pokemon' } } }
      }
      #swagger.responses[400] = {
        description: 'Dados de entrada inválidos',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } }
      }
      #swagger.responses[404] = {
        description: 'Pokémon não encontrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
      }
    */
    return pokemonController.patch(req, res, next);
});
pokemonRoutes.delete('/:id', (0, validate_request_1.validateRequest)({ params: pokemon_schemas_1.pokemonIdParamsSchema }), (req, res, next) => {
    /*
    #swagger.auto = false
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Remove um Pokémon'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'Número da Pokédex do Pokémon a ser removido' }
    #swagger.responses[204] = { description: 'Pokémon removido com sucesso' }
    #swagger.responses[400] = {
      description: 'Id inválido',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
    }
  */
    return pokemonController.delete(req, res, next);
});
