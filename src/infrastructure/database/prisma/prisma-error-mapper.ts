// src/infrastructure/database/prisma/prisma-error-mapper.ts
import { Prisma } from '@prisma/client';
import { AppError } from '@domain/errors/app-error';
import { ConflictError } from '@domain/errors/conflict-error';
import { NotFoundError } from '@domain/errors/not-found-error';

// Nome do model do Prisma -> nome em português para a mensagem
const ENTITY_LABELS: Record<string, string> = {
  Trainer: 'Treinador',
  Pokemon: 'Pokémon',
};

export class PrismaErrorMapper {
  static toAppError(error: Prisma.PrismaClientKnownRequestError): AppError {
    switch (error.code) {
      case 'P2002': {
        // Violação de constraint única (ex: e-mail de treinador repetido)
        const target = Array.isArray(error.meta?.target)
          ? (error.meta?.target as string[]).join(', ')
          : 'campo';
        return new ConflictError(
          `Já existe um registro cadastrado com este ${target}`,
        );
      }
      case 'P2025': {
        // Registro não encontrado para atualização ou exclusão
        const model = String(error.meta?.modelName ?? '');
        const entity = ENTITY_LABELS[model] ?? 'Registro';
        return new NotFoundError(`${entity} não encontrado no banco de dados`);
      }
      case 'P2003': {
        // Violação de chave estrangeira (ex: trainerId que não existe)
        return new AppError(
          'Relacionamento inválido. O recurso associado não existe',
          400,
        );
      }
      default:
        return new AppError(
          'Erro ao processar operação no banco de dados',
          500,
        );
    }
  }
}
