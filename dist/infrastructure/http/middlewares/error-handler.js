"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const app_error_1 = require("../../../domain/errors/app-error.js");
const prisma_error_mapper_1 = require("../../database/prisma/prisma-error-mapper.js");
// O "funil": todo erro da aplicação converge para cá e sai SEMPRE no mesmo
// formato { status, statusCode, message, details? }. O Express reconhece um
// middleware de erro pelos 4 parâmetros (error, req, res, next).
const send = (res, statusCode, message, details) => {
    const payload = {
        status: 'error',
        statusCode,
        message,
    };
    if (details !== undefined && details !== null)
        payload.details = details;
    return res.status(statusCode).json(payload);
};
const errorHandler = (error, _req, res, _next) => {
    // 1. Erros operacionais de domínio/aplicação (404, 409, 400, 503...)
    if (error instanceof app_error_1.AppError) {
        return send(res, error.statusCode, error.message, error.details);
    }
    // 2. Erros de validação da borda (Zod) que escaparam do middleware
    if (error instanceof zod_1.ZodError) {
        const details = error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        return send(res, 400, 'Dados de entrada inválidos', details);
    }
    // 3. JSON malformado no corpo da requisição (erro do express.json())
    if (error.type === 'entity.parse.failed') {
        return send(res, 400, 'O corpo da requisição não é um JSON válido');
    }
    // 4. Erros conhecidos do Prisma, traduzidos para erros de domínio
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const appError = prisma_error_mapper_1.PrismaErrorMapper.toAppError(error);
        return send(res, appError.statusCode, appError.message);
    }
    // 5. Qualquer outra coisa é bug/falha de sistema: loga o detalhe (com stack)
    //    no servidor e devolve ao cliente apenas uma mensagem genérica.
    console.error('💥 [Unhandled System Error]:', error);
    return send(res, 500, 'Erro interno no servidor.');
};
exports.errorHandler = errorHandler;
