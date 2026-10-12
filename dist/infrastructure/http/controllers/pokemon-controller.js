"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonController = void 0;
// O Controller só traduz HTTP <-> Use Cases. Nenhuma regra de negócio aqui.
// Os dados já chegam VALIDADOS (o middleware validateRequest roda antes) e
// qualquer erro é repassado ao funil global com next(error).
class PokemonController {
    createPokemonUseCase;
    importPokemonUseCase;
    listPokemonsUseCase;
    getPokemonByIdUseCase;
    updatePokemonUseCase;
    deletePokemonUseCase;
    getPokemonStatsUseCase;
    constructor(createPokemonUseCase, importPokemonUseCase, listPokemonsUseCase, getPokemonByIdUseCase, updatePokemonUseCase, deletePokemonUseCase, getPokemonStatsUseCase) {
        this.createPokemonUseCase = createPokemonUseCase;
        this.importPokemonUseCase = importPokemonUseCase;
        this.listPokemonsUseCase = listPokemonsUseCase;
        this.getPokemonByIdUseCase = getPokemonByIdUseCase;
        this.updatePokemonUseCase = updatePokemonUseCase;
        this.deletePokemonUseCase = deletePokemonUseCase;
        this.getPokemonStatsUseCase = getPokemonStatsUseCase;
    }
    async create(req, res, next) {
        try {
            const body = req.body;
            const pokemon = await this.createPokemonUseCase.execute(body);
            return res
                .status(201)
                .json({ message: 'Pokémon cadastrado com sucesso!', data: pokemon });
        }
        catch (error) {
            next(error);
        }
    }
    async import(req, res, next) {
        try {
            const { pokemon: identifier } = req.body;
            const pokemon = await this.importPokemonUseCase.execute(identifier);
            return res
                .status(201)
                .json({ message: 'Pokémon importado com sucesso!', data: pokemon });
        }
        catch (error) {
            next(error);
        }
    }
    async list(req, res, next) {
        try {
            const { type } = req.query;
            const pokemons = await this.listPokemonsUseCase.execute({ type });
            return res.status(200).json(pokemons);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const pokemon = await this.getPokemonByIdUseCase.execute(id);
            return res.status(200).json(pokemon);
        }
        catch (error) {
            next(error);
        }
    }
    // PUT: substituição completa (o schema já exigiu todos os campos)
    async replace(req, res, next) {
        try {
            const { id } = req.params;
            const body = req.body;
            const pokemon = await this.updatePokemonUseCase.execute(id, body);
            return res.status(200).json(pokemon);
        }
        catch (error) {
            next(error);
        }
    }
    // PATCH: atualização parcial (o schema exigiu ao menos 1 campo)
    async patch(req, res, next) {
        try {
            const { id } = req.params;
            const body = req.body;
            const pokemon = await this.updatePokemonUseCase.execute(id, body);
            return res.status(200).json(pokemon);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await this.deletePokemonUseCase.execute(id);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async stats(_req, res, next) {
        try {
            const stats = await this.getPokemonStatsUseCase.execute();
            return res.status(200).json(stats);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PokemonController = PokemonController;
