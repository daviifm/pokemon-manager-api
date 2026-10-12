// src/infrastructure/database/pg/postgres-pool.ts
import { Pool } from 'pg';

// Pool de conexões do driver nativo `pg` (singleton). Só conecta na 1ª consulta.
export const postgresPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
