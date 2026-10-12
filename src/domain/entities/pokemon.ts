// src/domain/entities/pokemon.ts
import { ValidationError } from '@domain/errors/validation-error';
import { BaseStats, BaseStatsProps } from '@domain/value-objects/base-stats';
import { PokemonType, isPokemonType } from '@domain/value-objects/pokemon-type';

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 100;

export interface PokemonProps {
  id: string; // UUID da instância (este Pokémon específico)
  pokedexNumber: number; // Número da Pokédex Nacional (identifica a ESPÉCIE)
  name: string;
  types: readonly string[]; // 1 ou 2 tipos
  baseStats: BaseStatsProps;
  level: number;
  trainerId?: string | null; // null/ausente = Pokémon selvagem
  spriteUrl?: string | null;
  baseExperience?: number | null;
  height?: number | null;
  weight?: number | null;
}

function assertOptionalNonNegativeInt(
  value: number | null | undefined,
  label: string,
): void {
  if (value != null && (!Number.isInteger(value) || value < 0)) {
    throw new ValidationError(`${label} deve ser um inteiro não negativo`);
  }
}

// Entidade imutável: para "alterar" um Pokémon criamos outro (passando de novo
// pelo construtor), o que garante que as regras abaixo valem SEMPRE.
export class Pokemon {
  public readonly id: string;
  public readonly pokedexNumber: number;
  public readonly name: string;
  public readonly types: readonly PokemonType[];
  public readonly baseStats: BaseStats;
  public readonly level: number;
  public readonly trainerId: string | null;
  public readonly spriteUrl: string | null;
  public readonly baseExperience: number | null;
  public readonly height: number | null;
  public readonly weight: number | null;

  constructor(props: PokemonProps) {
    if (!props.id?.trim()) {
      throw new ValidationError('O id do Pokémon é obrigatório');
    }

    if (!Number.isInteger(props.pokedexNumber) || props.pokedexNumber < 1) {
      throw new ValidationError(
        'O número da Pokédex deve ser um inteiro positivo',
      );
    }

    const name = props.name?.trim();
    if (!name) {
      throw new ValidationError('O nome do Pokémon é obrigatório');
    }

    if (
      !Number.isInteger(props.level) ||
      props.level < MIN_LEVEL ||
      props.level > MAX_LEVEL
    ) {
      throw new ValidationError(
        `O nível deve ser um inteiro entre ${MIN_LEVEL} e ${MAX_LEVEL}`,
      );
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

    assertOptionalNonNegativeInt(props.baseExperience, 'A experiência base');
    assertOptionalNonNegativeInt(props.height, 'A altura');
    assertOptionalNonNegativeInt(props.weight, 'O peso');

    this.id = props.id;
    this.pokedexNumber = props.pokedexNumber;
    this.name = name;
    this.types = types;
    this.baseStats = new BaseStats(props.baseStats);
    this.level = props.level;
    this.trainerId = props.trainerId ?? null;
    this.spriteUrl = props.spriteUrl ?? null;
    this.baseExperience = props.baseExperience ?? null;
    this.height = props.height ?? null;
    this.weight = props.weight ?? null;
  }

  // Devolve uma NOVA instância com as mudanças (e revalida tudo no construtor).
  with(changes: { level?: number; trainerId?: string | null }): Pokemon {
    return new Pokemon({
      id: this.id,
      pokedexNumber: this.pokedexNumber,
      name: this.name,
      types: this.types,
      baseStats: this.baseStats,
      level: changes.level ?? this.level,
      trainerId:
        changes.trainerId === undefined ? this.trainerId : changes.trainerId,
      spriteUrl: this.spriteUrl,
      baseExperience: this.baseExperience,
      height: this.height,
      weight: this.weight,
    });
  }
}
