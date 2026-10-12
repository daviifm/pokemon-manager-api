"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
// src/domain/errors/not-found-error.ts
const app_error_1 = require("./app-error");
// Recebe a MENSAGEM COMPLETA (ex: 'Treinador não encontrado').
class NotFoundError extends app_error_1.AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
