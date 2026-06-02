import constructorReducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState
} from '../src/services/slices/constructor-slice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 100,
  image: 'test.png',
  image_mobile: 'test-mobile.png',
  image_large: 'test-large.png',
  __v: 0
};

const mockIngredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 100,
  fat: 50,
  carbohydrates: 30,
  calories: 300,
  price: 200,
  image: 'test.png',
  image_mobile: 'test-mobile.png',
  image_large: 'test-large.png',
  __v: 0
};

describe(' редьюсер burgerConstructor', () => {
  it('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('обработка экшена добавления ингредиента', () => {
    it('должен добавлять ингредиент в пустой конструктор', () => {
      const result = constructorReducer(initialState, addIngredient(mockIngredient));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]._id).toBe(mockIngredient._id);
      expect(result.ingredients[0].name).toBe(mockIngredient.name);
      expect(result.ingredients[0]).toHaveProperty('id');
      expect(result.ingredients[0].id).toBeDefined();
    });

    it('должен добавлять несколько ингредиентов', () => {
      const result = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const result2 = constructorReducer(
        result,
        addIngredient({ ...mockIngredient, _id: 'ingredient-2', name: 'Тестовый ингредиент 2' })
      );

      expect(result2.ingredients).toHaveLength(2);
      expect(result2.ingredients[0].id).not.toBe(result2.ingredients[1].id);
    });
  });

  describe('обработка экшена добавления булки', () => {
    it('должен устанавливать булку', () => {
      const result = constructorReducer(initialState, setBun(mockBun));

      expect(result.bun).toEqual(mockBun);
      expect(result.bun?.name).toBe('Тестовая булка');
    });

    it('должен заменять существующую булку', () => {
      const stateWithBun = { ...initialState, bun: mockBun };
      const newBun = { ...mockBun, _id: 'bun-2', name: 'Новая булка' };

      const result = constructorReducer(stateWithBun, setBun(newBun));

      expect(result.bun?._id).toBe('bun-2');
      expect(result.bun?.name).toBe('Новая булка');
    });
  });

  describe('обработка экшена удаления ингредиента', () => {
    it('должен удалять ингредиент по id', () => {
      const stateWithIngredient = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'unique-id-1' },
          { ...mockIngredient, _id: 'ingredient-2', id: 'unique-id-2' }
        ]
      };

      const result = constructorReducer(
        stateWithIngredient,
        removeIngredient('unique-id-1')
      );

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].id).toBe('unique-id-2');
    });

    it('не должен удалять булку при removeIngredient', () => {
      const stateWithBunAndIngredient = {
        ...initialState,
        bun: mockBun,
        ingredients: [{ ...mockIngredient, id: 'unique-id-1' }]
      };

      const result = constructorReducer(
        stateWithBunAndIngredient,
        removeIngredient('unique-id-1')
      );

      expect(result.bun).toEqual(mockBun);
      expect(result.ingredients).toHaveLength(0);
    });
  });

  describe('обработка экшена изменения порядка ингредиентов', () => {
    it('должен перемещать ингредиент с одного индекса на другой', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1', name: 'Первый' },
          { ...mockIngredient, id: 'id-2', name: 'Второй' },
          { ...mockIngredient, id: 'id-3', name: 'Третий' }
        ]
      };

      const result = constructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(result.ingredients[0].id).toBe('id-2');
      expect(result.ingredients[1].id).toBe('id-3');
      expect(result.ingredients[2].id).toBe('id-1');
    });

    it('должен перемещать ингредиент в начало', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1', name: 'Первый' },
          { ...mockIngredient, id: 'id-2', name: 'Второй' }
        ]
      };

      const result = constructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 1, toIndex: 0 })
      );

      expect(result.ingredients[0].id).toBe('id-2');
      expect(result.ingredients[1].id).toBe('id-1');
    });
  });

  describe('обработка экшена очистки конструктора', () => {
    it('должен очищать конструктор', () => {
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [{ ...mockIngredient, id: 'unique-id-1' }]
      };

      const result = constructorReducer(stateWithIngredients, clearConstructor());

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });
  });
});