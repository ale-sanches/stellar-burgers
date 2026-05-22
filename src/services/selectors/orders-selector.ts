import { RootState } from '../store';

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export const selectOrderCreating = (state: RootState) =>
  state.orders.isOrderCreating;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectTotal = (state: RootState) => state.orders.total;
export const selectTotalToday = (state: RootState) => state.orders.totalToday;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
