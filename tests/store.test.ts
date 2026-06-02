import store from '../src/services/store';
import ingredientsReducer from '../src/services/slices/ingredients-slice';
import ordersReducer from '../src/services/slices/orders-slice';
import userReducer from '../src/services/slices/user-slice';
import constructorReducer from '../src/services/slices/constructor-slice';
import { combineReducers } from '@reduxjs/toolkit';

describe('Инициализация rootReducer', () => {
  it('вызов rootReducer с undefined состоянием и неизвестным экшеном возвращает корректное начальное состояние', () => {
    const rootReducer = combineReducers({
      ingredients: ingredientsReducer,
      orders: ordersReducer,
      user: userReducer,
      burgerConstructor: constructorReducer
    });
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем начальное состояние всех редюсеров
    expect(initialState.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
    expect(initialState.orders).toEqual({
      orders: [],
      isLoading: false,
      isOrderCreating: false,
      error: null,
      total: 0,
      totalToday: 0,
      currentOrder: null
    });
    expect(initialState.user).toEqual({
      user: null,
      isLoading: false,
      error: null,
      isAuthChecked: false
    });
    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен инициализировать все редюсеры корректно', () => {
    const state = store.getState();

    // Проверяем, что все ключи редюсеров присутствуют
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('burgerConstructor');
  });

  it('должен иметь корректные редюсеры', () => {
    const rootReducer = store.reduce;

    // Проверяем типы редюсеров через getState
    const state = store.getState();

    // ingredients должен иметь начальное состояние
    expect(state.ingredients).toBeDefined();
    expect(state.ingredients).toHaveProperty('ingredients');
    expect(state.ingredients).toHaveProperty('isLoading');
    expect(state.ingredients).toHaveProperty('error');

    // orders должен иметь начальное состояние
    expect(state.orders).toBeDefined();
    expect(state.orders).toHaveProperty('isLoading');
    expect(state.orders).toHaveProperty('error');
    expect(state.orders).toHaveProperty('orders');

    // user должен иметь начальное состояние
    expect(state.user).toBeDefined();
    expect(state.user).toHaveProperty('isAuthChecked');
    expect(state.user).toHaveProperty('user');

    // burgerConstructor должен иметь начальное состояние
    expect(state.burgerConstructor).toBeDefined();
    expect(state.burgerConstructor).toHaveProperty('bun');
    expect(state.burgerConstructor).toHaveProperty('ingredients');
  });

  it('должен экспортировать корректные типы RootState и AppDispatch', () => {
    // RootState должен быть типа состояния хранилища
    type TestRootState = ReturnType<typeof store.getState>;
    const state: TestRootState = store.getState();

    expect(state.ingredients).toBeDefined();
    expect(state.orders).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.burgerConstructor).toBeDefined();

    // AppDispatch должен быть типа dispatch хранилища
    type TestAppDispatch = typeof store.dispatch;
    const dispatch: TestAppDispatch = store.dispatch;

    expect(dispatch).toBeDefined();
  });
});