import path from 'path';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'PokéManager API',
    description: 'API RESTful para gerenciamento de um catálogo de Pokémons, construída com Clean Architecture.',
  },
  host: 'localhost:3333',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Pokemons', description: 'Endpoints de gerenciamento de Pokémons' },
  ],
  definitions: {
    Pokemon: { id: '1', name: 'Pikachu', type: 'Electric' },
    CreatePokemonDto: { $id: '1', $name: 'Pikachu', $type: 'Electric' },
    UpdatePokemonDto: { name: 'Raichu', type: 'Electric' },
    ErrorResponse: { message: 'Pokémon com id 1 não encontrado' },
  },
};

const outputFile = path.resolve(__dirname, 'swagger-output.json');
const endpointsFiles = [path.resolve(__dirname, '../server.ts')];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);