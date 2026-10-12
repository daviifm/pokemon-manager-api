// src/domain/errors/not-found-error.ts
import { AppError } from './app-error';

// Recebe a MENSAGEM COMPLETA (ex: 'Treinador não encontrado').
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
