// src/infrastructure/http/controllers/pokemon-controller.ts
import { Request, Response } from 'express';
import { CreatePokemonUseCase } from '@application/use-cases/create-pokemon';
import { DeletePokemonUseCase } from '@application/use-cases/delete-pokemon';
import { GetPokemonByIdUseCase } from '@application/use-cases/get-pokemon-by-id';
import { GetPokemonStatsUseCase } from '@application/use-cases/get-pokemon-stats';
import { ListPokemonsUseCase } from '@application/use-cases/list-pokemons';
import { SearchPokemonsByNameUseCase } from '@application/use-cases/search-pokemons-by-name';
import { UpdatePokemonLevelUseCase } from '@application/use-cases/update-pokemon-level';
import { UpdatePokemonUseCase } from '@application/use-cases/update-pokemon';
import {
  CreatePokemonInput,
  ListPokemonsQuery,
} from '../schemas/pokemon-schemas';
import { presentPokemon } from './presenters';

// Controller "fino": traduz HTTP <-> Use Case. SEM try/catch: erros sobem para o
// asyncHandler -> errorHandler. Os dados já chegam validados pelo Zod.
export class PokemonController {
  constructor(
    private readonly createPokemon: CreatePokemonUseCase,
    private readonly listPokemons: ListPokemonsUseCase,
    private readonly searchByName: SearchPokemonsByNameUseCase,
    private readonly getById: GetPokemonByIdUseCase,
    private readonly updatePokemon: UpdatePokemonUseCase,
    private readonly updateLevel: UpdatePokemonLevelUseCase,
    private readonly deletePokemon: DeletePokemonUseCase,
    private readonly getStats: GetPokemonStatsUseCase,
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreatePokemonInput;
    const pokemon = await this.createPokemon.execute(body);
    res.status(201).json({
      message: 'Pokémon cadastrado com sucesso!',
      data: presentPokemon(pokemon),
    });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const result = await this.listPokemons.execute(
      req.query as unknown as ListPokemonsQuery,
    );
    res
      .status(200)
      .json({ data: result.data.map(presentPokemon), meta: result.meta });
  };

  search = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.query as { name: string };
    const pokemons = await this.searchByName.execute(name);
    res.status(200).json({ data: pokemons.map(presentPokemon) });
  };

  show = async (req: Request, res: Response): Promise<void> => {
    const pokemon = await this.getById.execute(String(req.params.id));
    res.status(200).json({ data: presentPokemon(pokemon) });
  };

  replace = async (req: Request, res: Response): Promise<void> => {
    const pokemon = await this.updatePokemon.execute(
      String(req.params.id),
      req.body,
    );
    res.status(200).json({
      message: 'Pokémon atualizado com sucesso!',
      data: presentPokemon(pokemon),
    });
  };

  patchLevel = async (req: Request, res: Response): Promise<void> => {
    const pokemon = await this.updateLevel.execute(
      String(req.params.id),
      req.body.level,
    );
    res.status(200).json({
      message: 'Nível atualizado com sucesso!',
      data: presentPokemon(pokemon),
    });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.deletePokemon.execute(String(req.params.id));
    res.status(204).send();
  };

  stats = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json(await this.getStats.execute());
  };
}
