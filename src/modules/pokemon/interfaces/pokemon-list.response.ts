export interface PokemonListResponse {
  count: number;
  next: string;
  previous?: null;
  results: Results[];
}

export interface Results {
  name: string;
  url: string;
}
