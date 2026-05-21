import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { TNewOrderResponse } from '@api';
import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi,
  orderBurgerApi
} from '@api';

interface OrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  total: number;
  totalToday: number;
  currentOrder: TNewOrderResponse | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  total: 0,
  totalToday: 0,
  currentOrder: null
};

export const getFeeds = createAsyncThunk('orders/getFeeds', async () => {
  const data = await getFeedsApi();
  return data;
});

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load feeds';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load orders';
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load order';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingIndex = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (existingIndex >= 0) {
          state.orders[existingIndex] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      });
  }
});

export default ordersSlice.reducer;
