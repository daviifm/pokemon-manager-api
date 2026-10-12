// src/main/factories/make-pokemon-controller.ts
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { CreatePokemonUseCase } from '@application/use-cases/create-pokemon';
import { DeletePokemonUseCase } from '@application/use-cases/delete-pokemon';
import { GetPokemonByIdUseCase } from '@application/use-cases/get-pokemon-by-id';
import { GetPokemonStatsUseCase } from '@application/use-cases/get-pokemon-stats';
import { ListPokemonsUseCase } from '@application/use-cases/list-pokemons';
import { SearchPokemonsByNameUseCase } from '@application/use-cases/search-pokemons-by-name';
import { UpdatePokemonLevelUseCase } from '@application/use-cases/update-pokemon-level';
import { UpdatePokemonUseCase } from '@application/use-cases/update-pokemon';
import { InMemoryPokemonGateway } from '@infrastructure/gateways/in-memory-pokemon-gateway';
import { PokeApiAxiosGateway } from '@infrastructure/gateways/poke-api-axios-gateway';
import { PokemonController } from '@infrastructure/http/controllers/pokemon-controller';
import { makeRepositories } from './repositories';

// USE_EXTERNAL_API=false (ou NODE_ENV=test) troca a PokéAPI real por um gateway
// em memória: dá para desenvolver offline e rodar testes sem rede.
function makeGateway(): PokemonExternalGateway {
  const useReal =
    process.env.USE_EXTERNAL_API !== 'false' && process.env.NODE_ENV !== 'test';
  return useReal ? new PokeApiAxiosGateway() : new InMemoryPokemonGateway();
}

export function makePokemonController(): PokemonController {
  const { pokemonRepository } = makeRepositories();
  const gateway = makeGateway();

  return new PokemonController(
    new CreatePokemonUseCase(pokemonRepository, gateway),
    new ListPokemonsUseCase(pokemonRepository),
    new SearchPokemonsByNameUseCase(pokemonRepository),
    new GetPokemonByIdUseCase(pokemonRepository),
    new UpdatePokemonUseCase(pokemonRepository),
    new UpdatePokemonLevelUseCase(pokemonRepository),
    new DeletePokemonUseCase(pokemonRepository),
    new GetPokemonStatsUseCase(pokemonRepository),
  );
}
