import { feedSlice, getFeeds } from '../feedSlice';
import { TOrder } from '@utils-types';

const reducer = feedSlice.reducer;

describe('feedSlice', () => {
  const mockOrders: TOrder[] = [
    {
      _id: 'order-1',
      status: 'done',
      name: 'Burger 1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 1001,
      ingredients: ['ingredient-1']
    },
    {
      _id: 'order-2',
      status: 'pending',
      name: 'Burger 2',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      number: 1002,
      ingredients: ['ingredient-1', 'ingredient-2']
    }
  ];

  const mockFeedData = {
    orders: mockOrders,
    total: 100,
    totalToday: 10
  };

  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  describe('getFeeds pending', () => {
    it('должен устанавливать loading в true при запросе', () => {
      const action = { type: getFeeds.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('getFeeds fulfilled', () => {
    it('должен сохранять заказы и статистику при успехе', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockFeedData
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.error).toBeNull();
    });
  });

  describe('getFeeds rejected', () => {
    it('должен сохранять ошибку при неудаче', () => {
      const errorMessage = 'Ошибка загрузки ленты';
      const action = {
        type: getFeeds.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен использовать сообщение по умолчанию, если ошибка не передана', () => {
      const action = {
        type: getFeeds.rejected.type,
        payload: undefined
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить ленту');
    });
  });
});
