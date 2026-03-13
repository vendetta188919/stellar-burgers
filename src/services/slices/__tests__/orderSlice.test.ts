import {
  orderSlice,
  createOrder,
  getOrderByNumber,
  initialState
} from '../orderSlice';
import { TOrder } from '@utils-types';

const reducer = orderSlice.reducer;

describe('orderSlice', () => {
  const mockOrder: TOrder = {
    _id: 'order-123',
    status: 'done',
    name: 'Test Burger',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['ingredient-1', 'ingredient-2']
  };

  describe('createOrder pending', () => {
    it('должен устанавливать orderRequest в true при создании заказа', () => {
      const action = { type: createOrder.pending.type };
      const state = reducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('createOrder fulfilled', () => {
    it('должен сохранять данные заказа и сбрасывать orderRequest при успехе', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = reducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });
  });

  describe('createOrder rejected', () => {
    it('должен сохранять ошибку и сбрасывать orderRequest при неудаче', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: createOrder.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getOrderByNumber pending', () => {
    it('должен устанавливать loading в true при запросе заказа', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('getOrderByNumber fulfilled', () => {
    it('должен сохранять заказ и устанавливать loading в false при успехе', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
    });
  });

  describe('getOrderByNumber rejected', () => {
    it('должен сохранять ошибку и устанавливать loading в false при неудаче', () => {
      const errorMessage = 'Заказ не найден';
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
