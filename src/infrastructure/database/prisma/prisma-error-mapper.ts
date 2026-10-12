// src/infrastructure/database/prisma/prisma-error-mapper.ts
import { Prisma } from '@prisma/client';
import { AppError } from '@domain/errors/app-error';
import { ConflictError } from '@domain/errors/conflict-error';
import { NotFoundError } from '@domain/errors/not-found-error';

export class PrismaErrorMapper {
  static toAppError(error: Prisma.PrismaClientKnownRequestError): AppError {
    switch (error.code) {
      case 'P2002': {
        // Violação de constraint única (ex: id de Pokémon repetido)
        const target = Array.isArray(error.meta?.target)
          ? (error.meta?.target as string[]).join(', ')
          : 'campo';
        return new ConflictError(
          `Já existe um registro cadastrado com este ${target}`,
        );
      }
      case 'P2025': {
        // Registro não encontrado para atualização ou exclusão
        return new NotFoundError('Registro no banco de dados');
      }
      case 'P2003': {
        // Violação de chave estrangeira
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
