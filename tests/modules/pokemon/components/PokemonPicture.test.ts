import { mount } from '@vue/test-utils';
import PokemonPicture from '@/modules/pokemon/components/PokemonPicture.vue';

describe('Pokemon Picture', () => {
  const pokemonId = 1;
  const imageSource = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;

  test('should render the hidden image when showPokemon prop is false', () => {
    const wrapper = mount(PokemonPicture, {
      props: {
        pokemonId: pokemonId,
        showPokemon: false,
      },
    });

    // expect(wrapper.find('.brightness-0').exists()).toBeTruthy();
    // expect(wrapper.find('.fade-in').exists()).toBeFalsy();
    const img = wrapper.find('img');
    const attributes = img.attributes();

    expect(attributes).toEqual(
      expect.objectContaining({
        class: 'brightness-0 h-50',
        src: imageSource,
      }),
    );
  });

  test('should render the visible image when showPokemon prop is true', () => {
    const wrapper = mount(PokemonPicture, {
      props: {
        pokemonId: pokemonId,
        showPokemon: true,
      },
    });

    // expect(wrapper.find('.fade-in').exists()).toBeTruthy();
    // expect(wrapper.find('.brightness-0').exists()).toBeFalsy();
    const img = wrapper.find('img');
    const attributes = img.attributes();

    expect(attributes).toEqual(
      expect.objectContaining({
        class: 'fade-in h-50',
        src: imageSource,
      }),
    );
  });
});
