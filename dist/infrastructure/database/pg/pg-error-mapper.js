"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translatePgError = translatePgError;
// src/infrastructure/database/pg/pg-error-mapper.ts
const app_error_1 = require("../../../domain/errors/app-error.js");
const conflict_error_1 = require("../../../domain/errors/conflict-error.js");
// Traduz os códigos nativos do PostgreSQL para erros de domínio e relança o resto.
//   23505 unique_violation       -> 409
//   23503 foreign_key_violation  -> 400
function translatePgError(error) {
    const code = error.code;
    if (code === '23505') {
        throw new conflict_error_1.ConflictError('Já existe um registro cadastrado com estes dados');
    }
    if (code === '23503') {
        throw new app_error_1.AppError('Relacionamento inválido. O recurso associado não existe', 400);
    }
    throw error;
}
