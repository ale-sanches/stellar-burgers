import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredients-slice';
import ordersReducer from './slices/orders-slice';
import userReducer from './slices/user-slice';
import constructorReducer from './slices/constructor-slice';

const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    orders: ordersReducer,
    user: userReducer,
    constructor: constructorReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
