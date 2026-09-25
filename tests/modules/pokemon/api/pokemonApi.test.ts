import { pokemonApi } from '@/modules/pokemon/api/pokemonApi';

describe('Pokemon API', () => {
  test('should be configured correctly', () => {
    const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

    expect(baseUrl).toBe(pokemonApi.defaults.baseURL);
  });
});
