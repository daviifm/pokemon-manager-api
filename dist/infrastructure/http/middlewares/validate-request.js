"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const app_error_1 = require("@domain/errors/app-error");
const validateRequest = (schemas) => {
    return async (req, _res, next) => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                const parsedQuery = await schemas.query.parseAsync(req.query);
                // No Express 5, `req.query` é um getter somente-leitura: atribuir direto
                // (req.query = ...) lança erro. defineProperty funciona no 4 e no 5.
                Object.defineProperty(req, 'query', {
                    value: parsedQuery,
                    writable: true,
                    configurable: true,
                    enumerable: true,
                });
            }
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const issueDetails = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                return next(new app_error_1.AppError('Dados de entrada inválidos', 400, issueDetails));
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
