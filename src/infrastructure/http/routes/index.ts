// src/infrastructure/http/routes/index.ts
import { Router } from 'express';
import { pokemonRoutes } from './pokemon-routes';

const routes = Router();

routes.use('/pokemons', pokemonRoutes);

export { routes };
