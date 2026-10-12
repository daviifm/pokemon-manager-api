// src/infrastructure/database/pg/pg-trainer-repository.ts
import { Trainer } from '@domain/entities/trainer';
import { AppError } from '@domain/errors/app-error';
import { NotFoundError } from '@domain/errors/not-found-error';
import { TrainerRepository } from '@domain/repositories/trainer-repository';
import { postgresPool } from './postgres-pool';

interface TrainerRow {
  id: string;
  name: string;
  email: string;
  city: string;
}

function toDomain(row: TrainerRow): Trainer {
  return new Trainer({
    id: row.id,
    name: row.name,
    email: row.email,
    city: row.city,
  });
}

// Captura o erro nativo 23505 (unique_violation) e converte para o nosso AppError.
function rethrowKnownPgErrors(error: unknown): never {
  if ((error as { code?: string }).code === '23505') {
    throw new AppError(
      'Já existe um Treinador cadastrado com este e-mail.',
      409,
    );
  }
  throw error;
}

export class PgTrainerRepository implements TrainerRepository {
  async create(trainer: Trainer): Promise<void> {
    const query =
      'INSERT INTO trainers (id, name, email, city) VALUES ($1, $2, $3, $4)';

    try {
      await postgresPool.query(query, [
        trainer.id,
        trainer.name,
        trainer.email,
        trainer.city,
      ]);
    } catch (error) {
      rethrowKnownPgErrors(error);
    }
  }

  async findAll(): Promise<Trainer[]> {
    const result = await postgresPool.query<TrainerRow>(
      'SELECT id, name, email, city FROM trainers ORDER BY created_at ASC, id ASC',
    );
    return result.rows.map(toDomain);
  }

  async findById(id: string): Promise<Trainer | null> {
    const result = await postgresPool.query<TrainerRow>(
      'SELECT id, name, email, city FROM trainers WHERE id = $1',
      [id],
    );
    return result.rows[0] ? toDomain(result.rows[0]) : null;
  }

  async update(trainer: Trainer): Promise<void> {
    try {
      await postgresPool.query(
        'UPDATE trainers SET name = $2, email = $3, city = $4 WHERE id = $1',
        [trainer.id, trainer.name, trainer.email, trainer.city],
      );
    } catch (error) {
      rethrowKnownPgErrors(error);
    }
  }

  // Transação: "solta" os Pokémons e remove o treinador, tudo ou nada.
  async delete(id: string): Promise<void> {
    const client = await postgresPool.connect();

    try {
      await client.query('BEGIN');
      await client.query(
        'UPDATE pokemons SET trainer_id = NULL WHERE trainer_id = $1',
        [id],
      );
      const result = await client.query('DELETE FROM trainers WHERE id = $1', [
        id,
      ]);

      if (result.rowCount === 0) {
        throw new NotFoundError('Treinador não encontrado no banco de dados');
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
