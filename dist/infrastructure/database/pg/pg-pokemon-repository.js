"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgPokemonRepository = void 0;
// src/infrastructure/database/pg/pg-pokemon-repository.ts
const pokemon_1 = require("../../../domain/entities/pokemon.js");
const postgres_pool_1 = require("./postgres-pool");
const pg_error_mapper_1 = require("./pg-error-mapper");
const COLUMNS = `id, pokedex_number, name, types, level, hp, attack, defense,
  special_attack, special_defense, speed, sprite_url, base_experience, height, weight, trainer_id`;
const ORDER_BY = 'ORDER BY pokedex_number ASC, created_at ASC, id ASC';
function toDomain(row) {
    return new pokemon_1.Pokemon({
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
function escapeLike(term) {
    return term.replace(/[\\%_]/g, '\\$&');
}
// SQL puro com PARÂMETROS PREPARADOS ($1, $2...): os valores nunca são
// concatenados na string da query, o que impede SQL Injection. Nos filtros
// dinâmicos só concatenamos FRAGMENTOS FIXOS escritos aqui (nunca dado do usuário).
class PgPokemonRepository {
    async create(pokemon) {
        const query = `
      INSERT INTO pokemons (
        id, pokedex_number, name, types, level, hp, attack, defense,
        special_attack, special_defense, speed, sprite_url, base_experience,
        height, weight, trainer_id, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())`;
        try {
            await postgres_pool_1.postgresPool.query(query, [
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
        }
        catch (error) {
            (0, pg_error_mapper_1.translatePgError)(error);
        }
    }
    async findAll(filters) {
        const conditions = ['level BETWEEN $1 AND $2'];
        const params = [filters.minLevel, filters.maxLevel];
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
        const countResult = await postgres_pool_1.postgresPool.query(`SELECT COUNT(*) AS total FROM pokemons WHERE ${where}`, params);
        const rows = await postgres_pool_1.postgresPool.query(`SELECT ${COLUMNS} FROM pokemons WHERE ${where} ${ORDER_BY}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, filters.limit, offset]);
        // COUNT(*) volta como string (bigint) no driver `pg`
        return {
            items: rows.rows.map(toDomain),
            total: Number(countResult.rows[0].total),
        };
    }
    async listAll() {
        const result = await postgres_pool_1.postgresPool.query(`SELECT ${COLUMNS} FROM pokemons ${ORDER_BY}`);
        return result.rows.map(toDomain);
    }
    async findById(id) {
        const result = await postgres_pool_1.postgresPool.query(`SELECT ${COLUMNS} FROM pokemons WHERE id = $1`, [id]);
        return result.rows[0] ? toDomain(result.rows[0]) : null;
    }
    // ILIKE = LIKE sem diferenciar maiúsculas/minúsculas (exclusivo do PostgreSQL)
    async searchByName(term) {
        const result = await postgres_pool_1.postgresPool.query(`SELECT ${COLUMNS} FROM pokemons WHERE name ILIKE $1 ${ORDER_BY}`, [`%${escapeLike(term)}%`]);
        return result.rows.map(toDomain);
    }
    async countByTrainerId(trainerId) {
        const result = await postgres_pool_1.postgresPool.query('SELECT COUNT(*) AS total FROM pokemons WHERE trainer_id = $1', [trainerId]);
        return Number(result.rows[0].total);
    }
    async update(pokemon) {
        try {
            await postgres_pool_1.postgresPool.query('UPDATE pokemons SET level = $2, trainer_id = $3, updated_at = NOW() WHERE id = $1', [pokemon.id, pokemon.level, pokemon.trainerId]);
        }
        catch (error) {
            (0, pg_error_mapper_1.translatePgError)(error);
        }
    }
    async updateLevel(id, newLevel) {
        await postgres_pool_1.postgresPool.query('UPDATE pokemons SET level = $1, updated_at = NOW() WHERE id = $2', [newLevel, id]);
    }
    async delete(id) {
        await postgres_pool_1.postgresPool.query('DELETE FROM pokemons WHERE id = $1', [id]);
    }
}
exports.PgPokemonRepository = PgPokemonRepository;
