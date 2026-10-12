// src/infrastructure/http/controllers/pokemon-controller.ts
import { Request, Response, NextFunction } from 'express';
import { CreatePokemonUseCase } from '@application/use-cases/create-pokemon';
import { ImportPokemonFromPokeApiUseCase } from '@application/use-cases/import-pokemon-from-pokeapi';
import { ListPokemonsUseCase } from '@application/use-cases/list-pokemons';
import { GetPokemonByIdUseCase } from '@application/use-cases/get-pokemon-by-id';
import { UpdatePokemonUseCase } from '@application/use-cases/update-pokemon';
import { DeletePokemonUseCase } from '@application/use-cases/delete-pokemon';
import { GetPokemonStatsUseCase } from '@application/use-cases/get-pokemon-stats';
import {
  CreatePokemonBody,
  ImportPokemonBody,
  ListPokemonsQuery,
  PatchPokemonBody,
  PokemonIdParams,
  ReplacePokemonBody,
} from '../schemas/pokemon-schemas';

// O Controller só traduz HTTP <-> Use Cases. Nenhuma regra de negócio aqui.
// Os dados já chegam VALIDADOS (o middleware validateRequest roda antes) e
// qualquer erro é repassado ao funil global com next(error).
export class PokemonController {
  constructor(
    private readonly createPokemonUseCase: CreatePokemonUseCase,
    private readonly importPokemonUseCase: ImportPokemonFromPokeApiUseCase,
    private readonly listPokemonsUseCase: ListPokemonsUseCase,
    private readonly getPokemonByIdUseCase: GetPokemonByIdUseCase,
    private readonly updatePokemonUseCase: UpdatePokemonUseCase,
    private readonly deletePokemonUseCase: DeletePokemonUseCase,
    private readonly getPokemonStatsUseCase: GetPokemonStatsUseCase,
  ) {}

  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const body = req.body as CreatePokemonBody;
      const pokemon = await this.createPokemonUseCase.execute(body);

      return res
        .status(201)
        .json({ message: 'Pokémon cadastrado com sucesso!', data: pokemon });
    } catch (error) {
      next(error);
    }
  }

  async import(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { pokemon: identifier } = req.body as ImportPokemonBody;
      const pokemon = await this.importPokemonUseCase.execute(identifier);

      return res
        .status(201)
        .json({ message: 'Pokémon importado com sucesso!', data: pokemon });
    } catch (error) {
      next(error);
    }
  }

  async list(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { type } = req.query as unknown as ListPokemonsQuery;
      const pokemons = await this.listPokemonsUseCase.execute({ type });

      return res.status(200).json(pokemons);
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id } = req.params as unknown as PokemonIdParams;
      const pokemon = await this.getPokemonByIdUseCase.execute(id);

      return res.status(200).json(pokemon);
    } catch (error) {
      next(error);
    }
  }

  // PUT: substituição completa (o schema já exigiu todos os campos)
  async replace(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id } = req.params as unknown as PokemonIdParams;
      const body = req.body as ReplacePokemonBody;
      const pokemon = await this.updatePokemonUseCase.execute(id, body);

      return res.status(200).json(pokemon);
    } catch (error) {
      next(error);
    }
  }

  // PATCH: atualização parcial (o schema exigiu ao menos 1 campo)
  async patch(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id } = req.params as unknown as PokemonIdParams;
      const body = req.body as PatchPokemonBody;
      const pokemon = await this.updatePokemonUseCase.execute(id, body);

      return res.status(200).json(pokemon);
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id } = req.params as unknown as PokemonIdParams;
      await this.deletePokemonUseCase.execute(id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async stats(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const stats = await this.getPokemonStatsUseCase.execute();

      return res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
