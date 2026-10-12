// src/infrastructure/database/pg/pg-pokemon-repository.ts
import { Pokemon } from '@domain/entities/pokemon';
import {
  PaginatedResult,
  PokemonListFilters,
  PokemonRepository,
} from '@domain/repositories/pokemon-repository';
import { postgresPool } from './postgres-pool';
import { translatePgError } from './pg-error-mapper';

// Linha da tabela `pokemons` (snake_case) como o driver `pg` a devolve.
interface PokemonRow {
  id: string;
  pokedex_number: number;
  name: string;
  types: string[];
  level: number;
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  sprite_url: string | null;
  base_experience: number | null;
  height: number | null;
  weight: number | null;
  trainer_id: string | null;
}

const COLUMNS = `id, pokedex_number, name, types, level, hp, attack, defense,
  special_attack, special_defense, speed, sprite_url, base_experience, height, weight, trainer_id`;

const ORDER_BY = 'ORDER BY pokedex_number ASC, created_at ASC, id ASC';

function toDomain(row: PokemonRow): Pokemon {
  return new Pokemon({
    id: row.id,
    pokedexNumber: row.pokedex_number,
    name: row.name,
    types: row.types,
    level: row.level,
    baseStats: {
      hp: row.hp,
      attack: row.attack,
      defense: row.defense,
      specialAttack: row.special_attack,
      specialDefense: row.special_defense,
      speed: row.speed,
    },
    spriteUrl: row.sprite_url,
    baseExperience: row.base_experience,
    height: row.height,
    weight: row.weight,
    trainerId: row.trainer_id,
  });
}

// "pika_%" digitado pelo usuário não pode virar curinga do LIKE: escapamos \ % _
function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, '\\$&');
}

// SQL puro com PARÂMETROS PREPARADOS ($1, $2...): os valores nunca são
// concatenados na string da query, o que impede SQL Injection. Nos filtros
// dinâmicos só concatenamos FRAGMENTOS FIXOS escritos aqui (nunca dado do usuário).
export class PgPokemonRepository implements PokemonRepository {
  async create(pokemon: Pokemon): Promise<void> {
    const query = `
      INSERT INTO pokemons (
        id, pokedex_number, name, types, level, hp, attack, defense,
        special_attack, special_defense, speed, sprite_url, base_experience,
        height, weight, trainer_id, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())`;

    try {
      await postgresPool.query(query, [
        pokemon.id,
        pokemon.pokedexNumber,
        pokemon.name,
        [...pokemon.types],
        pokemon.level,
        pokemon.baseStats.hp,
        pokemon.baseStats.attack,
        pokemon.baseStats.defense,
        pokemon.baseStats.specialAttack,
        pokemon.baseStats.specialDefense,
        pokemon.baseStats.speed,
        pokemon.spriteUrl,
        pokemon.baseExperience,
        pokemon.height,
        pokemon.weight,
        pokemon.trainerId,
      ]);
    } catch (error) {
      translatePgError(error);
    }
  }

  async findAll(
    filters: PokemonListFilters,
  ): Promise<PaginatedResult<Pokemon>> {
    const conditions: string[] = ['level BETWEEN $1 AND $2'];
    const params: unknown[] = [filters.minLevel, filters.maxLevel];

    if (filters.type) {
      params.push(filters.type);
      conditions.push(`$${params.length} = ANY(types)`);
    }
    if (filters.trainerId) {
      params.push(filters.trainerId);
      conditions.push(`trainer_id = $${params.length}`);
    }

    const where = conditions.join(' AND ');
    const offset = (filters.page - 1) * filters.limit;

    const countResult = await postgresPool.query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM pokemons WHERE ${where}`,
      params,
    );

    const rows = await postgresPool.query<PokemonRow>(
      `SELECT ${COLUMNS} FROM pokemons WHERE ${where} ${ORDER_BY}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, filters.limit, offset],
    );

    // COUNT(*) volta como string (bigint) no driver `pg`
    return {
      items: rows.rows.map(toDomain),
      total: Number(countResult.rows[0].total),
    };
  }

  async listAll(): Promise<Pokemon[]> {
    const result = await postgresPool.query<PokemonRow>(
      `SELECT ${COLUMNS} FROM pokemons ${ORDER_BY}`,
    );
    return result.rows.map(toDomain);
  }

  async findById(id: string): Promise<Pokemon | null> {
    const result = await postgresPool.query<PokemonRow>(
      `SELECT ${COLUMNS} FROM pokemons WHERE id = $1`,
      [id],
    );
    return result.rows[0] ? toDomain(result.rows[0]) : null;
  }

  // ILIKE = LIKE sem diferenciar maiúsculas/minúsculas (exclusivo do PostgreSQL)
  async searchByName(term: string): Promise<Pokemon[]> {
    const result = await postgresPool.query<PokemonRow>(
      `SELECT ${COLUMNS} FROM pokemons WHERE name ILIKE $1 ${ORDER_BY}`,
      [`%${escapeLike(term)}%`],
    );
    return result.rows.map(toDomain);
  }

  async countByTrainerId(trainerId: string): Promise<number> {
    const result = await postgresPool.query<{ total: string }>(
      'SELECT COUNT(*) AS total FROM pokemons WHERE trainer_id = $1',
      [trainerId],
    );
    return Number(result.rows[0].total);
  }

  async update(pokemon: Pokemon): Promise<void> {
    try {
      await postgresPool.query(
        'UPDATE pokemons SET level = $2, trainer_id = $3, updated_at = NOW() WHERE id = $1',
        [pokemon.id, pokemon.level, pokemon.trainerId],
      );
    } catch (error) {
      translatePgError(error);
    }
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    await postgresPool.query(
      'UPDATE pokemons SET level = $1, updated_at = NOW() WHERE id = $2',
      [newLevel, id],
    );
  }

  async delete(id: string): Promise<void> {
    await postgresPool.query('DELETE FROM pokemons WHERE id = $1', [id]);
  }
}
