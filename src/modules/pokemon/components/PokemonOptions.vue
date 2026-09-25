<template>

  <section class="mt-5 flex flex-col">
    <button v-for="{ name, id } in option" :key="id" :class="['capitalize disabled:shadow-none disabled:bg-gray-100', {
      correct: id === correctAnswer && blockSelection,
      incorrect: id !== correctAnswer && blockSelection
    }]" @click="$emit('selectedOption', id)" :disabled="blockSelection">
      {{ name }}
    </button>
  </section>

</template>

<script setup lang="ts">
import type { Pokemon } from '../interfaces';

interface Props {
  option: Pokemon[];
  blockSelection: boolean;
  correctAnswer: number;
}

defineProps<Props>();

defineEmits<{
  selectedOption: [id: number]
}>();

</script>

<style scoped>
@reference '../../../assets/styles.css';

button {
  @apply bg-white shadow-md rounded-lg p-3 m-2 text-center cursor-pointer w-40 transition-all hover:bg-gray-100;
}

.correct {
  @apply bg-blue-500 text-white hover:bg-blue-700;
}

.incorrect {
  @apply bg-red-100 opacity-70;
}
</style>
