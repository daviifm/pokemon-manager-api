export interface PokemonProps {
  id: string;
  name: string;
  type: string;
}

export class Pokemon {
  public readonly id: string;
  public name: string;
  public type: string;

  constructor(props: PokemonProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('O nome do Pokémon é obrigatório');
    }
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
  }
}