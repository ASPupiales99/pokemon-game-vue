import { mount } from '@vue/test-utils';
import PokemonOptions from '@/modules/pokemon/components/PokemonOptions.vue';

describe('PokemonOptions', () => {
  const options = [
    { id: 1, name: 'Bulbasaur' },
    { id: 2, name: 'Ivysaur' },
    { id: 3, name: 'Venusaur' },
  ];

  test('should render buttons with correct test', () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        option: options,
        blockSelection: false,
        correctAnswer: 1,
      },
    });

    const buttons = wrapper.findAll('button');

    expect(buttons.length).toBe(options.length);

    buttons.forEach((button, index) => {
      expect(button.text()).toBe(options[index]!.name);
      expect(button.attributes('class')).toBe(
        'capitalize disabled:shadow-none disabled:bg-gray-100',
      );
    });
  });

  test('should emit "selectedOption" event when a button is clicked', async () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        option: options,
        blockSelection: false,
        correctAnswer: 1,
      },
    });

    const [b1, b2, b3] = wrapper.findAll('button');

    await b1!.trigger('click');
    await b2!.trigger('click');
    await b3!.trigger('click');

    expect(wrapper.emitted('selectedOption')).toBeTruthy();
    expect(wrapper.emitted('selectedOption')?.[0]).toEqual([1]);
    expect(wrapper.emitted('selectedOption')?.[1]).toEqual([2]);
    expect(wrapper.emitted('selectedOption')?.[2]).toEqual([3]);
  });

  test('should disable buttons when "blockSelection" is true', async () => {
    const wrapper = mount(PokemonOptions, {
      props: {
        option: options,
        blockSelection: true,
        correctAnswer: 1,
      },
    });

    const buttons = wrapper.findAll('button');

    buttons.forEach((button) => {
      const attributes = Object.keys(button.attributes());
      expect(attributes).toContain('disabled');
    });
  });

  test('should apply correct and incorrect classes based on the selected option', async () => {
    const correctAnswer = 1;
    const wrapper = mount(PokemonOptions, {
      props: {
        option: options,
        blockSelection: true,
        correctAnswer: correctAnswer,
      },
    });

    const buttons = wrapper.findAll('button');

    buttons.forEach((button, index) => {
      if (options[index]!.id === correctAnswer) {
        expect(button.classes()).toContain('correct');
      } else {
        expect(button.classes()).toContain('incorrect');
      }
    });
  });
});
