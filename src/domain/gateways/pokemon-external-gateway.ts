// src/domain/gateways/pokemon-external-gateway.ts
import { BaseStatsProps } from '@domain/value-objects/base-stats';

// Formato LIMPO (já traduzido) dos dados que o domínio espera receber de uma
// fonte externa. Nenhum nome de campo "feio" da PokéAPI aparece aqui.
export interface ExternalPokemonDetails {
  pokedexNumber: number;
  name: string;
  types: string[];
  baseStats: BaseStatsProps;
  spriteUrl: string | null;
  baseExperience: number | null;
  height: number | null;
  weight: number | null;
}

// Contrato do Gateway. O Use Case depende só disto, nunca de Axios/PokéAPI.
export interface PokemonExternalGateway {
  findByName(name: string): Promise<ExternalPokemonDetails | null>;
}
