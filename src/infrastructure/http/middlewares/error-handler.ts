// src/infrastructure/http/middlewares/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '@domain/errors/app-error';
import { PrismaErrorMapper } from '@infrastructure/database/prisma/prisma-error-mapper';

// O "funil": todo erro da aplicação converge para cá e sai SEMPRE no mesmo
// formato { status, message, details? }. O Express reconhece um middleware de
// erro pelos 4 parâmetros (error, req, res, next).
export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  // 1. Erros operacionais de domínio/aplicação (404, 409, 400, 503...)
  if (error instanceof AppError) {
    const responsePayload: Record<string, unknown> = {
      status: 'error',
      message: error.message,
    };

    if (error.details !== undefined && error.details !== null) {
      responsePayload.details = error.details;
    }

    return res.status(error.statusCode).json(responsePayload);
  }

  // 2. Erros de validação da borda (Zod) que escaparam do middleware
  if (error instanceof ZodError) {
    const issueDetails = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Dados de entrada inválidos',
      details: issueDetails,
    });
  }

  // 3. JSON malformado no corpo da requisição (erro do express.json())
  if ((error as { type?: string }).type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'error',
      message: 'O corpo da requisição não é um JSON válido',
    });
  }

  // 4. Erros conhecidos do banco (Prisma), traduzidos para erros de domínio
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const appError = PrismaErrorMapper.toAppError(error);
    return res.status(appError.statusCode).json({
      status: 'error',
      message: appError.message,
    });
  }

  // 5. Qualquer outra coisa é bug/falha de sistema: loga o detalhe, esconde do cliente
  console.error('💥 [Unhandled System Error]:', error);

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
};
