// src/application/dtos/create-pokemon-dto.ts
import { BaseStatsProps } from '@domain/value-objects/base-stats';

export interface CreatePokemonDTO {
  id: number;
  name: string;
  types: string[];
  baseStats: BaseStatsProps;
  spriteUrl?: string | null;
}
