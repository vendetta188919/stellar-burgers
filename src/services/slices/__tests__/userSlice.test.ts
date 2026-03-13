import {
  userSlice,
  checkUserAuth,
  loginUser,
  registerUser,
  logoutUser
} from '../userSlice';
import { TUser } from '@utils-types';

const reducer = userSlice.reducer;

describe('userSlice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const initialState = {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null,
    loginError: null,
    registerError: null,
    updateUserError: null,
    forgotPasswordError: null,
    resetPasswordError: null
  };

  describe('checkUserAuth', () => {
    it('должен устанавливать loading в true при проверке авторизации', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    it('должен сохранять пользователя и устанавливать isAuthChecked в true при успехе', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it('должен устанавливать isAuthChecked в true и сбрасывать пользователя при неудаче', () => {
      const action = {
        type: checkUserAuth.rejected.type,
        payload: 'Ошибка авторизации'
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.user).toBeNull();
    });
  });

  describe('loginUser', () => {
    it('должен устанавливать loading в true и сбрасывать loginError при входе', () => {
      const stateWithError = { ...initialState, loginError: 'Старая ошибка' };
      const action = { type: loginUser.pending.type };
      const state = reducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.loginError).toBeNull();
    });

    it('должен сохранять пользователя при успешном входе', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен сохранять ошибку входа при неудаче', () => {
      const errorMessage = 'Неверные учетные данные';
      const action = {
        type: loginUser.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.loginError).toBe(errorMessage);
    });
  });

  describe('registerUser', () => {
    it('должен устанавливать loading в true при регистрации', () => {
      const action = { type: registerUser.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.registerError).toBeNull();
    });

    it('должен сохранять пользователя при успешной регистрации', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен сохранять ошибку регистрации при неудаче', () => {
      const errorMessage = 'Email уже используется';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.registerError).toBe(errorMessage);
    });
  });

  describe('logoutUser', () => {
    it('должен устанавливать loading в true при выходе', () => {
      const action = { type: logoutUser.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    it('должен сбрасывать пользователя при успешном выходе', () => {
      const stateWithUser = { ...initialState, user: mockUser };
      const action = { type: logoutUser.fulfilled.type };
      const state = reducer(stateWithUser, action);

      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен сохранять ошибку при неудачном выходе', () => {
      const errorMessage = 'Ошибка выхода';
      const action = {
        type: logoutUser.rejected.type,
        payload: errorMessage
      };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
