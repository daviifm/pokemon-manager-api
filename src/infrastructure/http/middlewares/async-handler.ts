// src/infrastructure/http/middlewares/async-handler.ts
import { NextFunction, Request, RequestHandler, Response } from 'express';

// Repassa qualquer erro (throw/reject) de um handler async para o errorHandler
// global. Assim os controllers ficam SEM try/catch. (O Express 5 já faz isso
// sozinho, mas mantemos o wrapper para funcionar igual no Express 4.)
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  ): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
