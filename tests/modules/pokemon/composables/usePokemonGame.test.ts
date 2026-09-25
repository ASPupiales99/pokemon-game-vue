import { GameStatus } from '@/modules/pokemon/interfaces';
import { withSetup } from '../../../utils/with-setup';
import { usePokemonGame } from '@/modules/pokemon/composables/usePokemonGame';
import { flushPromises } from '@vue/test-utils';
import { pokemonApi } from '@/modules/pokemon/api/pokemonApi';
import MockAdapter from 'axios-mock-adapter';
import { pokemonListFake } from '../../../data/mockPokemons.fake';
import confetti from 'canvas-confetti';

const mockPokemonApi = new MockAdapter(pokemonApi);

mockPokemonApi.onGet('/?limit=151').reply(200, {
  results: pokemonListFake,
});

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('userPokemonGame', () => {
  test('should initialize with correct default values', async () => {
    const [results] = withSetup(usePokemonGame);

    expect(results.gameStatus.value).toBe(GameStatus.Playing);
    expect(results.isLoading.value).toBe(true);
    expect(results.pokemonOptions.value).toEqual([]);
    expect(results.randomPokemon.value).toBeUndefined();
    expect(results.correctAnswers.value).toBe(0);
    expect(results.incorrectAnswers.value).toBe(0);

    await flushPromises();

    expect(results.isLoading.value).toBe(false);
    expect(results.pokemonOptions.value.length).toBe(4);
    expect(results.randomPokemon.value).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
    });
  });

  test('should correctly handle getPokemonOptions', async () => {
    const [results] = withSetup(usePokemonGame);

    await flushPromises();

    results.gameStatus.value = GameStatus.Won;
    results.getPokemonOptions(3);

    expect(results.gameStatus.value).toBe(GameStatus.Playing);
    expect(results.pokemonOptions.value.length).toBe(3);
  });

  test('should correctly handle getPokemonOptions with a different number of options', async () => {
    const [results] = withSetup(usePokemonGame);

    await flushPromises();

    results.getPokemonOptions();
    const firstFourPokemons = [...results.pokemonOptions.value].map((p) => p.name);

    results.getPokemonOptions();
    const secondFourPokemons = [...results.pokemonOptions.value].map((p) => p.name);

    secondFourPokemons.forEach((pokemon) => {
      expect(firstFourPokemons).not.toContain(pokemon);
    });
  });

  test('should correctly handle incorrect answers', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises();

    const { checkAnswer, gameStatus } = results;

    expect(gameStatus.value).toBe(GameStatus.Playing);

    checkAnswer(100000); // Incorrect answer

    expect(gameStatus.value).toBe(GameStatus.Lost);
    expect(results.incorrectAnswers.value).toBe(1);
  });

  test('should correctly handle correct answers', async () => {
    const [results] = withSetup(usePokemonGame);
    await flushPromises();

    const { checkAnswer, gameStatus, randomPokemon } = results;

    expect(gameStatus.value).toBe(GameStatus.Playing);

    checkAnswer(randomPokemon.value.id); // Correct answer

    expect(confetti).toHaveBeenCalled();
    expect(confetti).toHaveBeenCalledWith({
      particleCount: 300,
      spread: 160,
      origin: { y: 0.6 },
    });
    expect(gameStatus.value).toBe(GameStatus.Won);
    expect(results.correctAnswers.value).toBe(1);
  });
});
