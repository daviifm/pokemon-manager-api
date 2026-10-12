// src/domain/entities/pokemon.ts
import { ValidationError } from '@domain/errors/validation-error';
import { BaseStats, BaseStatsProps } from '@domain/value-objects/base-stats';
import { PokemonType, isPokemonType } from '@domain/value-objects/pokemon-type';

export interface PokemonProps {
  id: number; // Número da Pokédex Nacional (ex: Bulbasaur = 1)
  name: string;
  types: readonly string[]; // 1 ou 2 tipos
  baseStats: BaseStatsProps;
  spriteUrl?: string | null;
}

// Entidade imutável: para "alterar" um Pokémon criamos outro (passando de novo
// pelo construtor), o que garante que as regras abaixo valem SEMPRE.
export class Pokemon {
  public readonly id: number;
  public readonly name: string;
  public readonly types: readonly PokemonType[];
  public readonly baseStats: BaseStats;
  public readonly spriteUrl: string | null;

  constructor(props: PokemonProps) {
    if (!Number.isInteger(props.id) || props.id < 1) {
      throw new ValidationError('O id do Pokémon deve ser um inteiro positivo');
    }

    const name = props.name?.trim();
    if (!name) {
      throw new ValidationError('O nome do Pokémon é obrigatório');
    }

    if (props.types.length < 1 || props.types.length > 2) {
      throw new ValidationError('Um Pokémon deve ter 1 ou 2 tipos');
    }
    if (new Set(props.types).size !== props.types.length) {
      throw new ValidationError('Os tipos de um Pokémon não podem se repetir');
    }
    const types: PokemonType[] = [];
    for (const type of props.types) {
      if (!isPokemonType(type)) {
        throw new ValidationError(`Tipo inválido: "${type}"`);
      }
      types.push(type);
    }

    this.id = props.id;
    this.name = name;
    this.types = types;
    this.baseStats = new BaseStats(props.baseStats);
    this.spriteUrl = props.spriteUrl ?? null;
  }
}
