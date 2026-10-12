// src/main/factories/repositories.ts
// Composition Root dos repositórios: escolhe a implementação concreta conforme
// DB_DRIVER (prisma | pg | memory). Os Use Cases só enxergam as interfaces.
// Em NODE_ENV=test usamos sempre a memória (testes não dependem de banco).
import { PokemonRepository } from '@domain/repositories/pokemon-repository';
import { TrainerRepository } from '@domain/repositories/trainer-repository';
import { InMemoryPokemonRepository } from '@infrastructure/database/in-memory/in-memory-pokemon-repository';
import { InMemoryTrainerRepository } from '@infrastructure/database/in-memory/in-memory-trainer-repository';
import { PgPokemonRepository } from '@infrastructure/database/pg/pg-pokemon-repository';
import { PgTrainerRepository } from '@infrastructure/database/pg/pg-trainer-repository';
import { PrismaPokemonRepository } from '@infrastructure/database/prisma/prisma-pokemon-repository';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/prisma-trainer-repository';

export type DbDriver = 'prisma' | 'pg' | 'memory';

export function resolveDbDriver(): DbDriver {
  if (process.env.NODE_ENV === 'test') return 'memory';
  const driver = (process.env.DB_DRIVER ?? 'prisma').toLowerCase();
  if (driver === 'prisma' || driver === 'pg' || driver === 'memory')
    return driver;
  throw new Error(`DB_DRIVER inválido: "${driver}". Use prisma, pg ou memory.`);
}

interface Repositories {
  pokemonRepository: PokemonRepository;
  trainerRepository: TrainerRepository;
}

// Singleton: pokémons e treinadores compartilham o mesmo "banco" (importante na memória).
let cached: Repositories | undefined;

export function makeRepositories(): Repositories {
  if (cached) return cached;

  switch (resolveDbDriver()) {
    case 'pg':
      cached = {
        pokemonRepository: new PgPokemonRepository(),
        trainerRepository: new PgTrainerRepository(),
      };
      break;
    case 'memory': {
      const pokemonRepository = new InMemoryPokemonRepository();
      cached = {
        pokemonRepository,
        trainerRepository: new InMemoryTrainerRepository(pokemonRepository),
      };
      break;
    }
    default:
      cached = {
        pokemonRepository: new PrismaPokemonRepository(),
        trainerRepository: new PrismaTrainerRepository(),
      };
  }
  return cached;
}
