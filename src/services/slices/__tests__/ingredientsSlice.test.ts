import { ingredientsSlice, getIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const reducer = ingredientsSlice.reducer;

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  const initialState = {
    items: [] as TIngredient[],
    loading: false,
    error: null as string | null
  };

  describe('getIngredients pending', () => {
    it('должен устанавливать loading в true при запросе', () => {
      const action = { type: getIngredients.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('getIngredients fulfilled', () => {
    it('должен сохранять ингредиенты и устанавливать loading в false при успехе', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    it('должен заменять старые ингредиенты новыми', () => {
      const stateWithData = {
        items: [{ ...mockIngredients[0], name: 'Старая булка' }],
        loading: true,
        error: null as string | null
      };

      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = reducer(stateWithData, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.items[0].name).toBe('Краторная булка N-200i');
    });
  });

  describe('getIngredients rejected', () => {
    it('должен сохранять ошибку и устанавливать loading в false при неудаче', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: getIngredients.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });

    it('должен использовать сообщение по умолчанию, если ошибка не передана', () => {
      const action = {
        type: getIngredients.rejected.type,
        payload: undefined
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить ингредиенты');
    });
  });
});
