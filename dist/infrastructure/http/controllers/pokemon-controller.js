"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonController = void 0;
const presenters_1 = require("./presenters");
// Controller "fino": traduz HTTP <-> Use Case. SEM try/catch: erros sobem para o
// asyncHandler -> errorHandler. Os dados já chegam validados pelo Zod.
class PokemonController {
    createPokemon;
    listPokemons;
    searchByName;
    getById;
    updatePokemon;
    updateLevel;
    deletePokemon;
    getStats;
    constructor(createPokemon, listPokemons, searchByName, getById, updatePokemon, updateLevel, deletePokemon, getStats) {
        this.createPokemon = createPokemon;
        this.listPokemons = listPokemons;
        this.searchByName = searchByName;
        this.getById = getById;
        this.updatePokemon = updatePokemon;
        this.updateLevel = updateLevel;
        this.deletePokemon = deletePokemon;
        this.getStats = getStats;
    }
    create = async (req, res) => {
        const body = req.body;
        const pokemon = await this.createPokemon.execute(body);
        res.status(201).json({
            message: 'Pokémon cadastrado com sucesso!',
            data: (0, presenters_1.presentPokemon)(pokemon),
        });
    };
    list = async (req, res) => {
        const result = await this.listPokemons.execute(req.query);
        res
            .status(200)
            .json({ data: result.data.map(presenters_1.presentPokemon), meta: result.meta });
    };
    search = async (req, res) => {
        const { name } = req.query;
        const pokemons = await this.searchByName.execute(name);
        res.status(200).json({ data: pokemons.map(presenters_1.presentPokemon) });
    };
    show = async (req, res) => {
        const pokemon = await this.getById.execute(String(req.params.id));
        res.status(200).json({ data: (0, presenters_1.presentPokemon)(pokemon) });
    };
    replace = async (req, res) => {
        const pokemon = await this.updatePokemon.execute(String(req.params.id), req.body);
        res.status(200).json({
            message: 'Pokémon atualizado com sucesso!',
            data: (0, presenters_1.presentPokemon)(pokemon),
        });
    };
    patchLevel = async (req, res) => {
        const pokemon = await this.updateLevel.execute(String(req.params.id), req.body.level);
        res.status(200).json({
            message: 'Nível atualizado com sucesso!',
            data: (0, presenters_1.presentPokemon)(pokemon),
        });
    };
    remove = async (req, res) => {
        await this.deletePokemon.execute(String(req.params.id));
        res.status(204).send();
    };
    stats = async (_req, res) => {
        res.status(200).json(await this.getStats.execute());
    };
}
exports.PokemonController = PokemonController;
