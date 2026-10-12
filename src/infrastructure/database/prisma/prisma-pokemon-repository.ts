// src/infrastructure/database/prisma/prisma-pokemon-repository.ts
import { Pokemon as PokemonRow } from '@prisma/client';
import { Pokemon } from '@domain/entities/pokemon';
import {
  PaginatedResult,
  PokemonListFilters,
  PokemonRepository,
} from '@domain/repositories/pokemon-repository';
import { prisma } from './client';

const ORDER_BY = [
  { pokedexNumber: 'asc' as const },
  { createdAt: 'asc' as const },
  { id: 'asc' as const },
];

// Mappers: traduzem entre o "formato do banco" (linha da tabela) e o
// "formato do domínio" (entidade). O resto do sistema nunca vê o PokemonRow.
function toDomain(row: PokemonRow): Pokemon {
  return new Pokemon({
    id: row.id,
    pokedexNumber: row.pokedexNumber,
    name: row.name,
    types: row.types,
    level: row.level,
    baseStats: {
      hp: row.hp,
      attack: row.attack,
      defense: row.defense,
      specialAttack: row.specialAttack,
      specialDefense: row.specialDefense,
      speed: row.speed,
    },
    spriteUrl: row.spriteUrl,
    baseExperience: row.baseExperience,
    height: row.height,
    weight: row.weight,
    trainerId: row.trainerId,
  });
}

function toPersistence(pokemon: Pokemon) {
  return {
    id: pokemon.id,
    pokedexNumber: pokemon.pokedexNumber,
    name: pokemon.name,
    types: [...pokemon.types],
    level: pokemon.level,
    hp: pokemon.baseStats.hp,
    attack: pokemon.baseStats.attack,
    defense: pokemon.baseStats.defense,
    specialAttack: pokemon.baseStats.specialAttack,
    specialDefense: pokemon.baseStats.specialDefense,
    speed: pokemon.baseStats.speed,
    spriteUrl: pokemon.spriteUrl,
    baseExperience: pokemon.baseExperience,
    height: pokemon.height,
    weight: pokemon.weight,
    trainerId: pokemon.trainerId,
  };
}

// Erros nativos (P2002, P2003, P2025) NÃO são capturados aqui: sobem até o
// errorHandler global, onde o PrismaErrorMapper os traduz.
export class PrismaPokemonRepository implements PokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.create({ data: toPersistence(pokemon) });
  }

  async findAll(
    filters: PokemonListFilters,
  ): Promise<PaginatedResult<Pokemon>> {
    const where = {
      level: { gte: filters.minLevel, lte: filters.maxLevel },
      // `has` é o operador do Prisma para "a lista contém este valor"
      ...(filters.type ? { types: { has: filters.type } } : {}),
      ...(filters.trainerId ? { trainerId: filters.trainerId } : {}),
    };

    // Uma única transação: a lista da página e o total consultam o mesmo "instante"
    const [rows, total] = await prisma.$transaction([
      prisma.pokemon.findMany({
        where,
        orderBy: ORDER_BY,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.pokemon.count({ where }),
    ]);

    return { items: rows.map(toDomain), total };
  }

  async listAll(): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({ orderBy: ORDER_BY });
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Pokemon | null> {
    const row = await prisma.pokemon.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  // `mode: 'insensitive'` vira ILIKE no PostgreSQL
  async searchByName(term: string): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
      orderBy: ORDER_BY,
    });
    return rows.map(toDomain);
  }

  async countByTrainerId(trainerId: string): Promise<number> {
    return prisma.pokemon.count({ where: { trainerId } });
  }

  async update(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.update({
      where: { id: pokemon.id },
      data: { level: pokemon.level, trainerId: pokemon.trainerId },
    });
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    await prisma.pokemon.update({ where: { id }, data: { level: newLevel } });
  }

  async delete(id: string): Promise<void> {
    await prisma.pokemon.delete({ where: { id } });
  }
}
