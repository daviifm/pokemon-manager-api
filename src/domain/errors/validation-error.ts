// src/domain/errors/validation-error.ts
import { AppError } from './app-error';

// Violação de uma regra (invariante) do domínio. Ex: Pokémon sem nome.
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}
