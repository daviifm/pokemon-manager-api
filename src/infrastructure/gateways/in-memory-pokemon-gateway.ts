// src/infrastructure/gateways/in-memory-pokemon-gateway.ts
import { AppError } from '@domain/errors/app-error';
import {
  ExternalPokemonDetails,
  PokemonExternalGateway,
} from '@domain/gateways/pokemon-external-gateway';

const SPRITE = (n: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${n}.png`;

// Gateway "de mentira" para testes e desenvolvimento offline (USE_EXTERNAL_API=false).
// Mesmo contrato do gateway real: o Use Case não percebe a diferença.
const FAKE_DB: Record<string, ExternalPokemonDetails> = {
  bulbasaur: {
    pokedexNumber: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    baseStats: {
      hp: 45,
      attack: 49,
      defense: 49,
      specialAttack: 65,
      specialDefense: 65,
      speed: 45,
    },
    spriteUrl: SPRITE(1),
    baseExperience: 64,
    height: 7,
    weight: 69,
  },
  charmander: {
    pokedexNumber: 4,
    name: 'charmander',
    types: ['fire'],
    baseStats: {
      hp: 39,
      attack: 52,
      defense: 43,
      specialAttack: 60,
      specialDefense: 50,
      speed: 65,
    },
    spriteUrl: SPRITE(4),
    baseExperience: 62,
    height: 6,
    weight: 85,
  },
  charizard: {
    pokedexNumber: 6,
    name: 'charizard',
    types: ['fire', 'flying'],
    baseStats: {
      hp: 78,
      attack: 84,
      defense: 78,
      specialAttack: 109,
      specialDefense: 85,
      speed: 100,
    },
    spriteUrl: SPRITE(6),
    baseExperience: 267,
    height: 17,
    weight: 905,
  },
  pikachu: {
    pokedexNumber: 25,
    name: 'pikachu',
    types: ['electric'],
    baseStats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90,
    },
    spriteUrl: SPRITE(25),
    baseExperience: 112,
    height: 4,
    weight: 60,
  },
  seedot: {
    pokedexNumber: 273,
    name: 'seedot',
    types: ['grass'],
    baseStats: {
      hp: 40,
      attack: 40,
      defense: 50,
      specialAttack: 30,
      specialDefense: 30,
      speed: 30,
    },
    spriteUrl: SPRITE(273),
    baseExperience: 44,
    height: 5,
    weight: 40,
  },
};

export class InMemoryPokemonGateway implements PokemonExternalGateway {
  // Permite simular a PokéAPI fora do ar em testes.
  public shouldThrowError = false;

  async findByName(name: string): Promise<ExternalPokemonDetails | null> {
    if (this.shouldThrowError) {
      throw new AppError(
        'Serviço externo (PokeAPI) temporariamente indisponível. Tente novamente em instantes.',
        503,
      );
    }
    const found = FAKE_DB[name.trim().toLowerCase()];
    return found
      ? { ...found, types: [...found.types], baseStats: { ...found.baseStats } }
      : null;
  }
}
