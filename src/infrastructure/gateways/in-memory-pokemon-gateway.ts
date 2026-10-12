// src/infrastructure/gateways/in-memory-pokemon-gateway.ts
import {
  ExternalPokemonData,
  PokemonExternalGateway,
} from '@domain/gateways/pokemon-external-gateway';

const artwork = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

// Mock Gateway: simula a PokéAPI sem internet. Usado em testes (NODE_ENV=test)
// e em qualquer cenário em que você não queira depender da rede.
export class InMemoryPokemonGateway implements PokemonExternalGateway {
  public pokemons: ExternalPokemonData[] = [
    {
      id: 1,
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
      spriteUrl: artwork(1),
    },
    {
      id: 6,
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
      spriteUrl: artwork(6),
    },
    {
      id: 25,
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
      spriteUrl: artwork(25),
    },
    {
      id: 273,
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
      spriteUrl: artwork(273),
    },
  ];

  // Flag auxiliar para simular a PokéAPI fora do ar nos testes
  public shouldThrowError = false;

  async findByIdOrName(
    identifier: string | number,
  ): Promise<ExternalPokemonData | null> {
    if (this.shouldThrowError) {
      throw new Error('Serviço indisponível');
    }

    const key = String(identifier).trim().toLowerCase();

    return (
      this.pokemons.find(
        (pokemon) => String(pokemon.id) === key || pokemon.name === key,
      ) ?? null
    );
  }
}
