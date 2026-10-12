"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// src/infrastructure/database/prisma/client.ts
const client_1 = require("@prisma/client");
// Singleton: uma única instância (e um único pool de conexões) para toda a API.
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
});
