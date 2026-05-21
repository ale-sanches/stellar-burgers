import { RootState } from '../store';
import { ConstructorState } from '../slices/constructor-slice';

export const selectConstructorBun = (
  state: RootState
): ConstructorState['bun'] => state.burgerConstructor.bun;

export const selectConstructorIngredients = (
  state: RootState
): ConstructorState['ingredients'] => state.burgerConstructor.ingredients;
