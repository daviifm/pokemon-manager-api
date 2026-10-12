-- CreateTable
CREATE TABLE "trainers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pokemons" (
    "id" UUID NOT NULL,
    "pokedex_number" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "types" TEXT[],
    "level" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "special_attack" INTEGER NOT NULL,
    "special_defense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "sprite_url" TEXT,
    "base_experience" INTEGER,
    "height" INTEGER,
    "weight" INTEGER,
    "trainer_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pokemons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainers_email_key" ON "trainers"("email");

-- CreateIndex
CREATE INDEX "pokemons_trainer_id_idx" ON "pokemons"("trainer_id");

-- CreateIndex
CREATE INDEX "pokemons_name_idx" ON "pokemons"("name");

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
