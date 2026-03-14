import { ordersSlice, getOrders, initialState } from '../ordersSlice';
import { TOrder } from '@utils-types';

const reducer = ordersSlice.reducer;

describe('ordersSlice', () => {
  const mockOrders: TOrder[] = [
    {
      _id: 'order-1',
      status: 'done',
      name: 'My Burger 1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 2001,
      ingredients: ['ingredient-1']
    },
    {
      _id: 'order-2',
      status: 'done',
      name: 'My Burger 2',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      number: 2002,
      ingredients: ['ingredient-1', 'ingredient-2']
    }
  ];

  describe('getOrders pending', () => {
    it('должен устанавливать loading в true при запросе', () => {
      const action = { type: getOrders.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('getOrders fulfilled', () => {
    it('должен сохранять заказы и устанавливать loading в false при успехе', () => {
      const action = {
        type: getOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });
  });

  describe('getOrders rejected', () => {
    it('должен сохранять ошибку и устанавливать loading в false при неудаче', () => {
      const errorMessage = 'Ошибка загрузки истории';
      const action = {
        type: getOrders.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен использовать сообщение по умолчанию, если ошибка не передана', () => {
      const action = {
        type: getOrders.rejected.type,
        payload: undefined
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить историю заказов');
    });
  });
});
