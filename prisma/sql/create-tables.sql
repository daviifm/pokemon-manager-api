-- prisma/sql/create-tables.sql
-- Script de CREATE TABLE para quem usa o driver nativo `pg` (DB_DRIVER=pg).
-- É equivalente ao prisma/schema.prisma. Use UM caminho por banco:
--   * Prisma: `npx prisma migrate dev`  (NÃO rode este script)
--   * pg    : rode este script (pgAdmin > Query Tool, ou psql)

CREATE TABLE IF NOT EXISTS trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  city VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pokemons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pokedex_number INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  types TEXT[] NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 100),
  hp INTEGER NOT NULL,
  attack INTEGER NOT NULL,
  defense INTEGER NOT NULL,
  special_attack INTEGER NOT NULL,
  special_defense INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  sprite_url TEXT,
  base_experience INTEGER,
  height INTEGER,
  weight INTEGER,
  -- ON DELETE SET NULL: removido o treinador, o Pokémon fica "selvagem" (não é apagado)
  trainer_id UUID REFERENCES trainers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pokemons_trainer_id ON pokemons (trainer_id);
CREATE INDEX IF NOT EXISTS idx_pokemons_name ON pokemons (name);
