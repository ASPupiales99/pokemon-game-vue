<template>

  <section v-if="isLoading || randomPokemon?.id === null"
    class="flex flex-col justify-around items-center w-screen h-screen">
    <h1 class="text-3xl">Please, wait</h1>
    <h3 class="animate-pulse">Loading...</h3>
  </section>

  <section v-else class="flex flex-col justify-around items-center w-screen h-screen">
    <h1 class="text-3xl">Who's that Pokémon?</h1>
    <h3 class="capitalize">{{ gameStatus }}</h3>

    <div class="h-20">
      <button v-if="gameStatus !== GameStatus.Playing" @click="getPokemonOptions()"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-4 transition-all">
        New Game
      </button>
    </div>

    <!--Pokemon Image-->
    <PokemonPicture :pokemon-id="randomPokemon!.id" :show-pokemon="gameStatus !== GameStatus.Playing" />

    <!--Pokemon options-->
    <PokemonOptions :option="options" :block-selection="gameStatus !== GameStatus.Playing"
      :correct-answer="randomPokemon!.id" @selected-option="checkAnswer" />
  </section>

  <section class="fixed top-4 right-4 flex gap-4 rounded-lg bg-white px-4 py-2 shadow-md">
    <span class="text-green-600">Correct: {{ correctAnswers }}</span>
    <span class="text-red-600">Incorrect: {{ incorrectAnswers }}</span>
  </section>

</template>

<script setup lang="ts">
import PokemonOptions from '../components/PokemonOptions.vue';
import PokemonPicture from '../components/PokemonPicture.vue';
import { usePokemonGame } from '../composables/usePokemonGame.ts';
import { GameStatus } from '../interfaces';

const {
  randomPokemon,
  isLoading,
  gameStatus,
  pokemonOptions: options,
  correctAnswers,
  incorrectAnswers,
  checkAnswer,
  getPokemonOptions,
} = usePokemonGame();

</script>

<style scoped></style>
