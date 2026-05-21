import { TIngredient } from '@utils-types';

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count: number;
  onClick?: (ingredient: TIngredient) => void;
  onAdd?: (ingredient: TIngredient) => void;
};
