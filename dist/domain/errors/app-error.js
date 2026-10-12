"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// src/domain/errors/app-error.ts
// Classe base de todos os erros OPERACIONAIS (previsíveis) da aplicação.
// Ela não conhece HTTP/Express: só carrega uma mensagem, um código de status
// sugerido e detalhes opcionais. Quem traduz isso em resposta é o errorHandler.
class AppError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 400, details) {
        super(message);
        this.name = new.target.name;
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
