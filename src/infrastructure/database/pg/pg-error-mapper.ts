// src/infrastructure/database/pg/pg-error-mapper.ts
import { AppError } from '@domain/errors/app-error';
import { ConflictError } from '@domain/errors/conflict-error';

// Traduz os códigos nativos do PostgreSQL para erros de domínio e relança o resto.
//   23505 unique_violation       -> 409
//   23503 foreign_key_violation  -> 400
export function translatePgError(error: unknown): never {
  const code = (error as { code?: string }).code;

  if (code === '23505') {
    throw new ConflictError('Já existe um registro cadastrado com estes dados');
  }
  if (code === '23503') {
    throw new AppError(
      'Relacionamento inválido. O recurso associado não existe',
      400,
    );
  }

  throw error;
}
