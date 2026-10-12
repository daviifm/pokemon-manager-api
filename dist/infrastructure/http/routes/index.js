"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
// src/infrastructure/http/routes/index.ts
const express_1 = require("express");
const pokemon_routes_1 = require("./pokemon-routes");
const trainer_routes_1 = require("./trainer-routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.use('/pokemons', pokemon_routes_1.pokemonRoutes);
routes.use('/trainers', trainer_routes_1.trainerRoutes);
