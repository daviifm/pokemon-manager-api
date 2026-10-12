"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgTrainerRepository = void 0;
// src/infrastructure/database/pg/pg-trainer-repository.ts
const trainer_1 = require("../../../domain/entities/trainer.js");
const app_error_1 = require("../../../domain/errors/app-error.js");
const not_found_error_1 = require("../../../domain/errors/not-found-error.js");
const postgres_pool_1 = require("./postgres-pool");
function toDomain(row) {
    return new trainer_1.Trainer({
        id: row.id,
        name: row.name,
        email: row.email,
        city: row.city,
    });
}
// Captura o erro nativo 23505 (unique_violation) e converte para o nosso AppError.
function rethrowKnownPgErrors(error) {
    if (error.code === '23505') {
        throw new app_error_1.AppError('Já existe um Treinador cadastrado com este e-mail.', 409);
    }
    throw error;
}
class PgTrainerRepository {
    async create(trainer) {
        const query = 'INSERT INTO trainers (id, name, email, city) VALUES ($1, $2, $3, $4)';
        try {
            await postgres_pool_1.postgresPool.query(query, [
                trainer.id,
                trainer.name,
                trainer.email,
                trainer.city,
            ]);
        }
        catch (error) {
            rethrowKnownPgErrors(error);
        }
    }
    async findAll() {
        const result = await postgres_pool_1.postgresPool.query('SELECT id, name, email, city FROM trainers ORDER BY created_at ASC, id ASC');
        return result.rows.map(toDomain);
    }
    async findById(id) {
        const result = await postgres_pool_1.postgresPool.query('SELECT id, name, email, city FROM trainers WHERE id = $1', [id]);
        return result.rows[0] ? toDomain(result.rows[0]) : null;
    }
    async update(trainer) {
        try {
            await postgres_pool_1.postgresPool.query('UPDATE trainers SET name = $2, email = $3, city = $4 WHERE id = $1', [trainer.id, trainer.name, trainer.email, trainer.city]);
        }
        catch (error) {
            rethrowKnownPgErrors(error);
        }
    }
    // Transação: "solta" os Pokémons e remove o treinador, tudo ou nada.
    async delete(id) {
        const client = await postgres_pool_1.postgresPool.connect();
        try {
            await client.query('BEGIN');
            await client.query('UPDATE pokemons SET trainer_id = NULL WHERE trainer_id = $1', [id]);
            const result = await client.query('DELETE FROM trainers WHERE id = $1', [
                id,
            ]);
            if (result.rowCount === 0) {
                throw new not_found_error_1.NotFoundError('Treinador não encontrado no banco de dados');
            }
            await client.query('COMMIT');
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
}
exports.PgTrainerRepository = PgTrainerRepository;
