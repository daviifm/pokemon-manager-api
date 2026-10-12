// src/application/dtos/update-pokemon-dto.ts
import { BaseStatsProps } from '@domain/value-objects/base-stats';

// Todos os campos são opcionais: o Use Case mescla com o que já existe.
// (O PUT exige todos pelo schema Zod; o PATCH aceita só alguns.)
export interface UpdatePokemonDTO {
  name?: string;
  types?: string[];
  baseStats?: BaseStatsProps;
  spriteUrl?: string | null;
}
