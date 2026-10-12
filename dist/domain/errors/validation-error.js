"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
// src/domain/errors/validation-error.ts
const app_error_1 = require("./app-error");
// Violação de uma regra (invariante) do domínio. Ex: Pokémon sem nome.
class ValidationError extends app_error_1.AppError {
    constructor(message, details) {
        super(message, 400, details);
    }
}
exports.ValidationError = ValidationError;
