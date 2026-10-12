// src/main/factories/make-pokemon-controller.ts
// COMPOSITION ROOT do módulo de Pokémons: é o ÚNICO lugar que decide quais
// implementações concretas usar e que liga tudo (injeção de dependências).
import { PokemonRepository } from '@domain/repositories/pokemon-repository';
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { InMemoryPokemonRepository } from '@infrastructure/database/in-memory/in-memory-pokemon-repository';
import { PrismaPokemonRepository } from '@infrastructure/database/prisma/prisma-pokemon-repository';
import { InMemoryPokemonGateway } from '@infrastructure/gateways/in-memory-pokemon-gateway';
import { PokeApiGateway } from '@infrastructure/gateways/poke-api-gateway';
import { PokemonController } from '@infrastructure/http/controllers/pokemon-controller';
import { CreatePokemonUseCase } from '@application/use-cases/create-pokemon';
import { ImportPokemonFromPokeApiUseCase } from '@application/use-cases/import-pokemon-from-pokeapi';
import { ListPokemonsUseCase } from '@application/use-cases/list-pokemons';
import { GetPokemonByIdUseCase } from '@application/use-cases/get-pokemon-by-id';
import { UpdatePokemonUseCase } from '@application/use-cases/update-pokemon';
import { DeletePokemonUseCase } from '@application/use-cases/delete-pokemon';
import { GetPokemonStatsUseCase } from '@application/use-cases/get-pokemon-stats';

// Em testes (NODE_ENV=test) usamos dublês em memória: zero banco, zero internet.
const isTestEnvironment = process.env.NODE_ENV === 'test';

// Instâncias únicas: o repositório precisa ser compartilhado por todos os Use
// Cases e o gateway precisa ser único para o circuit breaker lembrar das falhas.
const pokemonRepository: PokemonRepository = isTestEnvironment
  ? new InMemoryPokemonRepository()
  : new PrismaPokemonRepository();

const pokemonGateway: PokemonExternalGateway = isTestEnvironment
  ? new InMemoryPokemonGateway()
  : new PokeApiGateway();

export function makePokemonController(): PokemonController {
  return new PokemonController(
    new CreatePokemonUseCase(pokemonRepository),
    new ImportPokemonFromPokeApiUseCase(pokemonRepository, pokemonGateway),
    new ListPokemonsUseCase(pokemonRepository),
    new GetPokemonByIdUseCase(pokemonRepository),
    new UpdatePokemonUseCase(pokemonRepository),
    new DeletePokemonUseCase(pokemonRepository),
    new GetPokemonStatsUseCase(pokemonRepository),
  );
}
