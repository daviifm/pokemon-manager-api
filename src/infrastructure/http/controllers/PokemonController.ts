import { Request, Response } from 'express';
import { CreatePokemonUseCase } from '@application/use-cases/CreatePokemonUseCase';
import { ListPokemonsUseCase } from '@application/use-cases/ListPokemonsUseCase';
import { DeletePokemonUseCase } from '@application/use-cases/DeletePokemonUseCase';
import { UpdatePokemonUseCase } from '@application/use-cases/UpdatePokemonUseCase';
import { GetPokemonStatsUseCase } from '@application/use-cases/GetPokemonStatsUseCase';
import { PokemonNotFoundError } from '@domain/errors/PokemonNotFoundError';

export class PokemonController {
  constructor(
    private createUseCase: CreatePokemonUseCase,
    private listUseCase: ListPokemonsUseCase,
    private deleteUseCase: DeletePokemonUseCase,
    private updateUseCase: UpdatePokemonUseCase,
    private statsUseCase: GetPokemonStatsUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<Response> => {
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
    return res.status(201).json({ message: 'Pokémon cadastrado com sucesso!', data: pokemon });
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
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

  delete = async (req: Request, res: Response): Promise<Response> => {
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
    } catch (err) {
      if (err instanceof PokemonNotFoundError) return res.status(404).json({ message: err.message });
      throw err;
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
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
    } catch (err) {
      if (err instanceof PokemonNotFoundError) return res.status(404).json({ message: err.message });
      throw err;
    }
  };

  stats = async (_req: Request, res: Response): Promise<Response> => {
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