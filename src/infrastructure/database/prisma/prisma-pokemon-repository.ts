// src/infrastructure/database/prisma/prisma-pokemon-repository.ts
import { Pokemon as PokemonRow } from '@prisma/client';
import { Pokemon } from '@domain/entities/pokemon';
import {
  PokemonFilters,
  PokemonRepository,
} from '@domain/repositories/pokemon-repository';
import { prisma } from './client';

// Mappers: traduzem entre o "formato do banco" (linha da tabela) e o
// "formato do domínio" (entidade). O resto do sistema nunca vê o PokemonRow.
function toDomain(row: PokemonRow): Pokemon {
  return new Pokemon({
    id: row.id,
    name: row.name,
    types: row.types,
    baseStats: {
      hp: row.hp,
      attack: row.attack,
      defense: row.defense,
      specialAttack: row.specialAttack,
      specialDefense: row.specialDefense,
      speed: row.speed,
    },
    spriteUrl: row.spriteUrl,
  });
}

function toPersistence(pokemon: Pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    types: [...pokemon.types],
    hp: pokemon.baseStats.hp,
    attack: pokemon.baseStats.attack,
    defense: pokemon.baseStats.defense,
    specialAttack: pokemon.baseStats.specialAttack,
    specialDefense: pokemon.baseStats.specialDefense,
    speed: pokemon.baseStats.speed,
    spriteUrl: pokemon.spriteUrl,
  };
}

export class PrismaPokemonRepository implements PokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.create({ data: toPersistence(pokemon) });
  }

  async findAll(filters?: PokemonFilters): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({
      // `has` é o operador do Prisma para "a lista contém este valor"
      where: filters?.type ? { types: { has: filters.type } } : undefined,
      orderBy: { id: 'asc' },
    });

    return rows.map(toDomain);
  }

  async findById(id: number): Promise<Pokemon | null> {
    const row = await prisma.pokemon.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async update(pokemon: Pokemon): Promise<void> {
    const { id, ...data } = toPersistence(pokemon);
    await prisma.pokemon.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.pokemon.delete({ where: { id } });
  }
}
