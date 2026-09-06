import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './config/swagger-output.json';

import { InMemoryPokemonRepository } from '@infrastructure/database/in-memory/InMemoryPokemonRepository';
import { CreatePokemonUseCase } from '@application/use-cases/CreatePokemonUseCase';
import { ListPokemonsUseCase } from '@application/use-cases/ListPokemonsUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/DeletePokemonUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/UpdatePokemonUseCase';
import { GetPokemonStatsUseCase } from '@application/use-cases/GetPokemonStatsUseCase';
import { PokemonController } from '@infrastructure/http/controllers/PokemonController';

const app = express();
app.use(express.json());

const repository = new InMemoryPokemonRepository();
const controller = new PokemonController(
  new CreatePokemonUseCase(repository),
  new ListPokemonsUseCase(repository),
  new DeletePokemonUseCase(repository),
  new UpdatePokemonUseCase(repository),
  new GetPokemonStatsUseCase(repository),
);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get('/api/v1/pokemons/stats', /* 
  #swagger.tags = ['Pokemons']
  #swagger.summary = 'Estatísticas gerais do catálogo'
  #swagger.responses[200] = {
    description: 'Estatísticas acumuladas',
    content: { 'application/json': { schema: { totalPokemons: 4, typesCount: { Grass: 1, Fire: 1 } } } }
  }
*/ controller.stats);

app.post('/api/v1/pokemons', /* 
  #swagger.tags = ['Pokemons']
  #swagger.summary = 'Cadastra um novo Pokémon'
  #swagger.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePokemonDto' } } }
  }
  #swagger.responses[201] = {
    description: 'Pokémon criado com sucesso',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Pokemon' } } }
  }
*/ controller.create);

app.get('/api/v1/pokemons', /* 
  #swagger.tags = ['Pokemons']
  #swagger.summary = 'Lista todos os Pokémons'
  #swagger.responses[200] = {
    description: 'Lista de Pokémons',
    content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Pokemon' } } } }
  }
*/ controller.list);

app.put('/api/v1/pokemons/:id', /* 
  #swagger.tags = ['Pokemons']
  #swagger.summary = 'Atualiza um Pokémon pelo ID'
  #swagger.parameters['id'] = { description: 'ID do Pokémon a ser atualizado' }
  #swagger.requestBody = {
    required: true,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePokemonDto' } } }
  }
  #swagger.responses[200] = {
    description: 'Pokémon atualizado com sucesso',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Pokemon' } } }
  }
  #swagger.responses[404] = {
    description: 'Pokémon não encontrado',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
  }
*/ controller.update);

app.delete('/api/v1/pokemons/:id', /* 
  #swagger.tags = ['Pokemons']
  #swagger.summary = 'Remove um Pokémon pelo ID'
  #swagger.parameters['id'] = { description: 'ID do Pokémon a ser removido' }
  #swagger.responses[204] = { description: 'Pokémon removido com sucesso' }
  #swagger.responses[404] = {
    description: 'Pokémon não encontrado',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
  }
*/ controller.delete);

app.listen(3333, () => console.log('Servidor rodando em http://localhost:3333'));