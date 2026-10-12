// src/application/dtos/pokemon-dtos.ts
export interface CreatePokemonDTO {
  name: string; // nome da espécie (ex: "charizard"): o resto vem da PokéAPI
  type?: string; // opcional: se informado, precisa ser um dos tipos reais da espécie
  level: number;
  trainerId?: string | null;
}

// PUT: substitui os campos editáveis (nível e treinador; null = selvagem)
export interface ReplacePokemonDTO {
  level: number;
  trainerId: string | null;
}
