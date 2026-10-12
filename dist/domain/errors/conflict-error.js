"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
// src/domain/errors/conflict-error.ts
const app_error_1 = require("./app-error");
class ConflictError extends app_error_1.AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
