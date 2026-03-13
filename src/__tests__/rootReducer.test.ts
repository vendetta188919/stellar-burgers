import { rootReducer } from '../services/rootReducer';

describe('rootReducer', () => {
  it('должен правильно инициализировать состояние', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем, что все слайсы присутствуют в состоянии
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');
  });

  it('должен возвращать начальное состояние ingredients', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state.ingredients).toEqual({
      items: [],
      loading: false,
      error: null
    });
  });

  it('должен возвращать начальное состояние burgerConstructor', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен возвращать начальное состояние order', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state.order).toEqual({
      orderRequest: false,
      orderModalData: null,
      currentOrder: null,
      loading: false,
      error: null
    });
  });

  it('должен возвращать начальное состояние feed', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });
  });

  it('должен возвращать начальное состояние orders', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state.orders).toEqual({
      orders: [],
      loading: false,
      error: null
    });
  });

  it('должен возвращать начальное состояние user', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state.user).toEqual({
      user: null,
      isAuthChecked: false,
      loading: false,
      error: null,
      loginError: null,
      registerError: null,
      updateUserError: null,
      forgotPasswordError: null,
      resetPasswordError: null
    });
  });
});
