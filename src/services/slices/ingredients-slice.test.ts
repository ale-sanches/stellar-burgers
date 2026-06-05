import ingredientsReducer, {
  getIngredients
} from './ingredients-slice';
import { TIngredient } from '@utils-types';

interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
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
  },
  {
    _id: '2',
    name: 'Начинка',
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
  }
];

describe('редьюсер ingredients', () => {
  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'unknown' });
    expect(result.ingredients).toEqual([]);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  describe('при вызове экшена pending (getIngredients.pending)', () => {
    it('isLoading должен становиться true', () => {
      const action = { type: getIngredients.pending.type };
      const result = ingredientsReducer(initialState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('при вызове экшена fulfilled (getIngredients.fulfilled)', () => {
    it('isLoading должен становиться false', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const stateWithLoading = { ...initialState, isLoading: true };
      const result = ingredientsReducer(stateWithLoading, action);

      expect(result.isLoading).toBe(false);
    });

    it('должен загружать ингредиенты в state', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.ingredients).toEqual(mockIngredients);
      expect(result.ingredients).toHaveLength(2);
    });
  });

  describe('при вызове экшена rejected (getIngredients.rejected)', () => {
    it('isLoading должен становиться false', () => {
      const action = {
        type: getIngredients.rejected.type,
        error: { message: 'Ошибка загрузки' }
      };
      const stateWithLoading = { ...initialState, isLoading: true };
      const result = ingredientsReducer(stateWithLoading, action);

      expect(result.isLoading).toBe(false);
    });

    it('должен устанавливать сообщение об ошибке', () => {
      const action = {
        type: getIngredients.rejected.type,
        error: { message: 'Network Error' }
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.error).toBe('Network Error');
    });

    it('должен использовать default сообщение при отсутствии error.message', () => {
      const action = {
        type: getIngredients.rejected.type,
        error: {}
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.error).toBe('Failed to load ingredients');
    });
  });
});