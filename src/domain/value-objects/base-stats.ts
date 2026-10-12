// src/domain/value-objects/base-stats.ts
import { ValidationError } from '@domain/errors/validation-error';

export interface BaseStatsProps {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

const STAT_LABELS: Record<keyof BaseStatsProps, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Sp. Attack',
  specialDefense: 'Sp. Defense',
  speed: 'Speed',
};

// Value Object: imutável e sem identidade própria (dois BaseStats com os mesmos
// valores são "iguais"). A regra de domínio: cada stat é um inteiro de 1 a 255
// (é o limite real dos jogos, onde o valor é guardado em 1 byte).
export class BaseStats {
  public readonly hp: number;
  public readonly attack: number;
  public readonly defense: number;
  public readonly specialAttack: number;
  public readonly specialDefense: number;
  public readonly speed: number;

  constructor(props: BaseStatsProps) {
    for (const key of Object.keys(STAT_LABELS) as (keyof BaseStatsProps)[]) {
      const value = props[key];
      if (!Number.isInteger(value) || value < 1 || value > 255) {
        throw new ValidationError(
          `${STAT_LABELS[key]} deve ser um inteiro entre 1 e 255`,
        );
      }
    }

    this.hp = props.hp;
    this.attack = props.attack;
    this.defense = props.defense;
    this.specialAttack = props.specialAttack;
    this.specialDefense = props.specialDefense;
    this.speed = props.speed;
  }

  // BST (Base Stat Total): a soma clássica usada no competitivo.
  get total(): number {
    return (
      this.hp +
      this.attack +
      this.defense +
      this.specialAttack +
      this.specialDefense +
      this.speed
    );
  }

  // Controla como o objeto vira JSON na resposta HTTP (getters não são
  // serializados sozinhos, então incluímos o `total` explicitamente).
  toJSON() {
    return {
      hp: this.hp,
      attack: this.attack,
      defense: this.defense,
      specialAttack: this.specialAttack,
      specialDefense: this.specialDefense,
      speed: this.speed,
      total: this.total,
    };
  }
}
