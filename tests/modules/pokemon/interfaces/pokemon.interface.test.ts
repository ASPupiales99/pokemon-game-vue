describe('Pokemon interface', () => {
  const pokemon = { id: 1, name: 'bulbasaur' };

  test('should have an id and name property', () => {
    expect(pokemon.id).toEqual(expect.any(Number));
    expect(pokemon.name).toEqual(expect.any(String));
  });
});
