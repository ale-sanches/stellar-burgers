import { RootState } from '../store';
import { ConstructorState } from '../slices/constructor-slice';

export const selectConstructorBun = (
  state: RootState
): ConstructorState['bun'] => (state.constructor as ConstructorState).bun;

export const selectConstructorIngredients = (
  state: RootState
): ConstructorState['ingredients'] =>
  (state.constructor as ConstructorState).ingredients;
