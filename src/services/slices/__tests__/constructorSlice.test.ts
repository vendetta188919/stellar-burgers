import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  initialState
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const reducer = constructorSlice.reducer;

describe('constructorSlice', () => {
  const mockBun: TIngredient = {
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
  };

  const mockFilling: TIngredient = {
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
  };

  const mockSauce: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  };

  describe('addIngredient', () => {
    it('должен добавлять булку в конструктор', () => {
      const action = addIngredient(mockBun);
      const state = reducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    it('должен добавлять начинку в конструктор', () => {
      const action = addIngredient(mockFilling);
      const state = reducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockFilling,
        id: expect.any(String)
      });
    });

    it('должен добавлять соус в конструктор', () => {
      const action = addIngredient(mockSauce);
      const state = reducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockSauce,
        id: expect.any(String)
      });
    });

    it('должен добавлять несколько ингредиентов в конструктор', () => {
      let state = reducer(initialState, addIngredient(mockBun));
      state = reducer(state, addIngredient(mockFilling));
      state = reducer(state, addIngredient(mockSauce));

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toHaveLength(2);
    });

    it('должен заменять булку при добавлении новой', () => {
      const newBun: TIngredient = {
        ...mockBun,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };

      let state = reducer(initialState, addIngredient(mockBun));
      state = reducer(state, addIngredient(newBun));

      expect(state.bun).toEqual(newBun);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент из конструктора', () => {
      // Сначала добавляем ингредиент
      let state = reducer(initialState, addIngredient(mockFilling));
      const ingredientId = state.ingredients[0].id;

      // Затем удаляем его
      state = reducer(state, removeIngredient(ingredientId));

      expect(state.ingredients).toHaveLength(0);
    });

    it('должен удалять только указанный ингредиент', () => {
      // Добавляем два ингредиента
      let state = reducer(initialState, addIngredient(mockFilling));
      state = reducer(state, addIngredient(mockSauce));

      const firstIngredientId = state.ingredients[0].id;

      // Удаляем первый ингредиент
      state = reducer(state, removeIngredient(firstIngredientId));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe(mockSauce.name);
    });
  });

  describe('moveIngredientUp', () => {
    it('должен перемещать ингредиент вверх', () => {
      // Добавляем два ингредиента
      let state = reducer(initialState, addIngredient(mockFilling));
      state = reducer(state, addIngredient(mockSauce));

      const firstId = state.ingredients[0].id;
      const secondId = state.ingredients[1].id;

      // Перемещаем второй ингредиент вверх (индекс 1 → 0)
      state = reducer(state, moveIngredientUp(1));

      expect(state.ingredients[0].id).toBe(secondId);
      expect(state.ingredients[1].id).toBe(firstId);
    });

    it('не должен перемещать первый ингредиент вверх', () => {
      // Добавляем ингредиент
      let state = reducer(initialState, addIngredient(mockFilling));
      const firstId = state.ingredients[0].id;

      // Пытаемся переместить первый ингредиент вверх
      state = reducer(state, moveIngredientUp(0));

      expect(state.ingredients[0].id).toBe(firstId);
      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredientDown', () => {
    it('должен перемещать ингредиент вниз', () => {
      // Добавляем два ингредиента
      let state = reducer(initialState, addIngredient(mockFilling));
      state = reducer(state, addIngredient(mockSauce));

      const firstId = state.ingredients[0].id;
      const secondId = state.ingredients[1].id;

      // Перемещаем первый ингредиент вниз (индекс 0 → 1)
      state = reducer(state, moveIngredientDown(0));

      expect(state.ingredients[0].id).toBe(secondId);
      expect(state.ingredients[1].id).toBe(firstId);
    });

    it('не должен перемещать последний ингредиент вниз', () => {
      // Добавляем ингредиент
      let state = reducer(initialState, addIngredient(mockFilling));
      const firstId = state.ingredients[0].id;

      // Пытаемся переместить последний ингредиент вниз
      state = reducer(state, moveIngredientDown(0));

      expect(state.ingredients[0].id).toBe(firstId);
      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать конструктор', () => {
      // Добавляем ингредиенты
      let state = reducer(initialState, addIngredient(mockBun));
      state = reducer(state, addIngredient(mockFilling));

      // Очищаем конструктор
      state = reducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
