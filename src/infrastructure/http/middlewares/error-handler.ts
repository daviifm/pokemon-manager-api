// src/infrastructure/http/middlewares/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '@domain/errors/app-error';
import { PrismaErrorMapper } from '@infrastructure/database/prisma/prisma-error-mapper';

// O "funil": todo erro da aplicação converge para cá e sai SEMPRE no mesmo
// formato { status, statusCode, message, details? }. O Express reconhece um
// middleware de erro pelos 4 parâmetros (error, req, res, next).
const send = (
  res: Response,
  statusCode: number,
  message: string,
  details?: unknown,
): Response => {
  const payload: Record<string, unknown> = {
    status: 'error',
    statusCode,
    message,
  };
  if (details !== undefined && details !== null) payload.details = details;
  return res.status(statusCode).json(payload);
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  // 1. Erros operacionais de domínio/aplicação (404, 409, 400, 503...)
  if (error instanceof AppError) {
    return send(res, error.statusCode, error.message, error.details);
  }

  // 2. Erros de validação da borda (Zod) que escaparam do middleware
  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return send(res, 400, 'Dados de entrada inválidos', details);
  }

  // 3. JSON malformado no corpo da requisição (erro do express.json())
  if ((error as { type?: string }).type === 'entity.parse.failed') {
    return send(res, 400, 'O corpo da requisição não é um JSON válido');
  }

  // 4. Erros conhecidos do Prisma, traduzidos para erros de domínio
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const appError = PrismaErrorMapper.toAppError(error);
    return send(res, appError.statusCode, appError.message);
  }

  // 5. Qualquer outra coisa é bug/falha de sistema: loga o detalhe (com stack)
  //    no servidor e devolve ao cliente apenas uma mensagem genérica.
  console.error('💥 [Unhandled System Error]:', error);
  return send(res, 500, 'Erro interno no servidor.');
};
