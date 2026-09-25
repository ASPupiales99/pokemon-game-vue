import { mount } from '@vue/test-utils';
import PokemonGame from '@/modules/pokemon/pages/PokemonGame.vue';
import type { Mock } from 'vitest';
import { usePokemonGame } from '@/modules/pokemon/composables/usePokemonGame';
import { GameStatus } from '@/modules/pokemon/interfaces/game-status.enum';

vi.mock('@/modules/pokemon/composables/usePokemonGame', () => ({
  usePokemonGame: vi.fn<() => void>(),
}));

const pokemonOptions = [
  { id: 1, name: 'Bulbasaur' },
  { id: 2, name: 'Ivysaur' },
  { id: 3, name: 'Venusaur' },
  { id: 4, name: 'Charmander' },
];

describe('Pokemon Game', () => {
  test('should initilize with default values', async () => {
    (usePokemonGame as Mock).mockReturnValue({
      randomPokemon: undefined,
      isLoading: true,
      gameStatus: GameStatus.Playing,
      pokemonOptions: [],
      checkAnswer: vi.fn<() => void>(),
      getPokemonOptions: vi.fn<() => void>(),
      correctAnswers: 0,
      incorrectAnswers: 0,
    });

    const wrapper = mount(PokemonGame);

    expect(wrapper.get('h1').text()).toBe('Please, wait');
    expect(wrapper.get('h1').classes()).toEqual(['text-3xl']);
    expect(wrapper.get('h3').text()).toBe('Loading...');
    expect(wrapper.get('h3').classes()).toEqual(['animate-pulse']);
  });

  test('should render pokemon picture and options when randomPokemon is defined', async () => {
    (usePokemonGame as Mock).mockReturnValue({
      randomPokemon: pokemonOptions[0],
      isLoading: false,
      gameStatus: GameStatus.Playing,
      pokemonOptions: pokemonOptions,
      checkAnswer: vi.fn<() => void>(),
      getPokemonOptions: vi.fn<() => void>(),
      correctAnswers: 0,
      incorrectAnswers: 0,
    });

    const wrapper = mount(PokemonGame);
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonOptions[0]!.id}.svg`;
    const buttons = wrapper.findAll('.capitalize.disabled\\:shadow-none.disabled\\:bg-gray-100');

    expect(wrapper.get('h1').text()).toBe("Who's that Pokémon?");
    expect(wrapper.findComponent({ name: 'PokemonPicture' }).exists()).toBe(true);
    expect(wrapper.find('img').attributes('src')).toBe(imageUrl);
    expect(wrapper.findComponent({ name: 'PokemonOptions' }).exists()).toBe(true);
    expect(buttons.length).toBe(4);
    buttons.forEach((button) => {
      expect(pokemonOptions.map((p) => p.name)).toContain(button.text());
    });
  });

  test('should render button for new game', () => {
    (usePokemonGame as Mock).mockReturnValue({
      randomPokemon: pokemonOptions[0],
      isLoading: false,
      gameStatus: GameStatus.Won,
      pokemonOptions: pokemonOptions,
      checkAnswer: vi.fn<() => void>(),
      getPokemonOptions: vi.fn<() => void>(),
      correctAnswers: 1,
      incorrectAnswers: 0,
    });

    const wrapper = mount(PokemonGame);
    const newGameButton = wrapper.find(
      '[class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-4 transition-all"]',
    );

    expect(newGameButton.exists()).toBe(true);
    expect(newGameButton.text()).toBe('New Game');
  });

  test('should call getPokemonOptions when new game button is clicked', async () => {
    const spyGetPokemonOptions = vi.fn<() => void>();

    (usePokemonGame as Mock).mockReturnValue({
      randomPokemon: pokemonOptions[0],
      isLoading: false,
      gameStatus: GameStatus.Won,
      pokemonOptions: pokemonOptions,
      checkAnswer: vi.fn<() => void>(),
      getPokemonOptions: spyGetPokemonOptions,
      correctAnswers: 1,
      incorrectAnswers: 0,
    });

    const wrapper = mount(PokemonGame);
    const newGameButton = wrapper.find(
      '[class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-4 transition-all"]',
    );

    await newGameButton.trigger('click');

    expect(spyGetPokemonOptions).toHaveBeenCalled();
    expect(spyGetPokemonOptions).toHaveBeenCalledWith();
  });
});
