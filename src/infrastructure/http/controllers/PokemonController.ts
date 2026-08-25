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
    const pokemon = await this.createUseCase.execute(req.body);
    return res.status(201).json({ message: 'Pokémon cadastrado com sucesso!', data: pokemon });
  };

  list = async (_req: Request, res: Response): Promise<Response> => {
    const pokemons = await this.listUseCase.execute();
    return res.status(200).json(pokemons);
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.deleteUseCase.execute(req.params.id);
      return res.status(204).send();
    } catch (err) {
      if (err instanceof PokemonNotFoundError) return res.status(404).json({ message: err.message });
      throw err;
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const pokemon = await this.updateUseCase.execute(req.params.id, req.body);
      return res.status(200).json(pokemon);
    } catch (err) {
      if (err instanceof PokemonNotFoundError) return res.status(404).json({ message: err.message });
      throw err;
    }
  };

  stats = async (_req: Request, res: Response): Promise<Response> => {
    const stats = await this.statsUseCase.execute();
    return res.status(200).json(stats);
  };
}