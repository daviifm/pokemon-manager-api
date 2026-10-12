// src/domain/gateways/pokemon-external-gateway.ts
import { BaseStatsProps } from '@domain/value-objects/base-stats';

// Formato LIMPO (já traduzido) dos dados que o domínio espera receber de uma
// fonte externa. Nenhum nome de campo "feio" da PokéAPI aparece aqui.
export interface ExternalPokemonData {
  id: number;
  name: string;
  types: string[];
  baseStats: BaseStatsProps;
  spriteUrl: string | null;
}

// Contrato do Gateway. O Use Case depende só disto, nunca de Axios/PokéAPI.
export interface PokemonExternalGateway {
  findByIdOrName(
    identifier: string | number,
  ): Promise<ExternalPokemonData | null>;
}
