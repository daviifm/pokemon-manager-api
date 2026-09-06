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

// /stats ANTES de /:id — rota fixa sempre antes de rota dinâmica no mesmo prefixo
app.get('/api/v1/pokemons/stats', controller.stats);
app.post('/api/v1/pokemons', controller.create);
app.get('/api/v1/pokemons', controller.list);
app.put('/api/v1/pokemons/:id', controller.update);
app.delete('/api/v1/pokemons/:id', controller.delete);

app.listen(3333, () => console.log('Servidor rodando em http://localhost:3333'));