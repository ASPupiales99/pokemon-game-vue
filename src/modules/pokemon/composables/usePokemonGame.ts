import { computed, onMounted, ref } from 'vue';
import { GameStatus, type Pokemon, type PokemonListResponse } from '../interfaces';
import { pokemonApi } from '../api/pokemonApi';
import confetti from 'canvas-confetti';

export const usePokemonGame = () => {
  const gameStatus = ref<GameStatus>(GameStatus.Playing);
  const pokemons = ref<Pokemon[]>([]);
  const pokemonOptions = ref<Pokemon[]>([]);
  const correctAnswers = ref(0);
  const incorrectAnswers = ref(0);

  const randomPokemon = computed(() => {
    const randomIndex = Math.floor(Math.random() * pokemonOptions.value.length);
    return pokemonOptions.value[randomIndex];
  });
  const isLoading = computed(() => pokemons.value.length === 0);

  const getPokemons = async (): Promise<Pokemon[]> => {
    const response = await pokemonApi.get<PokemonListResponse>('/?limit=151');

    const pokemonArray = response.data.results.map((pokemon) => {
      const urlParts = pokemon.url.split('/');
      const id = urlParts.at(-2) ?? 0;
      return {
        name: pokemon.name,
        id: +id,
      };
    });
    return pokemonArray.sort(() => Math.random() - 0.5);
  };

  const getPokemonOptions = (howMany: number = 4) => {
    gameStatus.value = GameStatus.Playing;
    pokemonOptions.value = pokemons.value.slice(0, howMany);
    pokemons.value = pokemons.value.slice(howMany);
  };

  const checkAnswer = (selectedId: number) => {
    const hasWon = randomPokemon.value!.id === selectedId;

    if (hasWon) {
      correctAnswers.value++;
      gameStatus.value = GameStatus.Won;
      confetti({
        particleCount: 300,
        spread: 160,
        origin: { y: 0.6 },
      });
      return;
    }

    incorrectAnswers.value++;
    gameStatus.value = GameStatus.Lost;
  };

  onMounted(async () => {
    pokemons.value = await getPokemons();
    getPokemonOptions();
  });

  return {
    gameStatus,
    isLoading,
    pokemonOptions,
    randomPokemon,
    correctAnswers,
    incorrectAnswers,
    // Methods
    getPokemonOptions,
    checkAnswer,
  };
};
