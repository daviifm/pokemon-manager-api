// src/infrastructure/database/prisma/client.ts
import { PrismaClient } from '@prisma/client';

// Singleton: uma única instância (e um único pool de conexões) para toda a API.
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});
