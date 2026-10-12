"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresPool = void 0;
// src/infrastructure/database/pg/postgres-pool.ts
const pg_1 = require("pg");
// Pool de conexões do driver nativo `pg` (singleton). Só conecta na 1ª consulta.
exports.postgresPool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
