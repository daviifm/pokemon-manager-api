// src/domain/entities/trainer.ts
import { ValidationError } from '@domain/errors/validation-error';

// Regra de negócio do universo Pokémon: um treinador carrega no máximo 6 Pokémons.
export const MAX_TEAM_SIZE = 6;

export interface TrainerProps {
  id: string;
  name: string;
  email: string;
  city: string;
}

export class Trainer {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly city: string;

  constructor(props: TrainerProps) {
    if (!props.id?.trim()) {
      throw new ValidationError('O id do treinador é obrigatório');
    }

    const name = props.name?.trim();
    if (!name) {
      throw new ValidationError('O nome do treinador é obrigatório');
    }

    const email = props.email?.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      throw new ValidationError('O e-mail do treinador é inválido');
    }

    const city = props.city?.trim();
    if (!city) {
      throw new ValidationError('A cidade do treinador é obrigatória');
    }

    this.id = props.id;
    this.name = name;
    this.email = email;
    this.city = city;
  }
}
