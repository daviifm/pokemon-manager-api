"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonController = void 0;
const PokemonNotFoundError_1 = require("../../../domain/errors/PokemonNotFoundError.js");
class PokemonController {
    createUseCase;
    listUseCase;
    deleteUseCase;
    updateUseCase;
    statsUseCase;
    constructor(createUseCase, listUseCase, deleteUseCase, updateUseCase, statsUseCase) {
        this.createUseCase = createUseCase;
        this.listUseCase = listUseCase;
        this.deleteUseCase = deleteUseCase;
        this.updateUseCase = updateUseCase;
        this.statsUseCase = statsUseCase;
    }
    create = async (req, res) => {
        /*
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
        */
        const pokemon = await this.createUseCase.execute(req.body);
        return res
            .status(201)
            .json({ message: 'Pokémon cadastrado com sucesso!', data: pokemon });
    };
    list = async (_req, res) => {
        /*
          #swagger.tags = ['Pokemons']
          #swagger.summary = 'Lista todos os Pokémons'
          #swagger.responses[200] = {
            description: 'Lista de Pokémons',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Pokemon' } } } }
          }
        */
        const pokemons = await this.listUseCase.execute();
        return res.status(200).json(pokemons);
    };
    delete = async (req, res) => {
        /*
          #swagger.tags = ['Pokemons']
          #swagger.summary = 'Remove um Pokémon pelo ID'
          #swagger.parameters['id'] = { description: 'ID do Pokémon a ser removido' }
          #swagger.responses[204] = { description: 'Pokémon removido com sucesso' }
          #swagger.responses[404] = {
            description: 'Pokémon não encontrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
          }
        */
        try {
            await this.deleteUseCase.execute(req.params.id);
            return res.status(204).send();
        }
        catch (err) {
            if (err instanceof PokemonNotFoundError_1.PokemonNotFoundError)
                return res.status(404).json({ message: err.message });
            throw err;
        }
    };
    update = async (req, res) => {
        /*
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
        */
        try {
            const pokemon = await this.updateUseCase.execute(req.params.id, req.body);
            return res.status(200).json(pokemon);
        }
        catch (err) {
            if (err instanceof PokemonNotFoundError_1.PokemonNotFoundError)
                return res.status(404).json({ message: err.message });
            throw err;
        }
    };
    stats = async (_req, res) => {
        /*
          #swagger.tags = ['Pokemons']
          #swagger.summary = 'Estatísticas gerais do catálogo'
          #swagger.responses[200] = {
            description: 'Estatísticas acumuladas',
            content: { 'application/json': { schema: { totalPokemons: 4, typesCount: { Grass: 1, Fire: 1 } } } }
          }
        */
        const stats = await this.statsUseCase.execute();
        return res.status(200).json(stats);
    };
}
exports.PokemonController = PokemonController;
