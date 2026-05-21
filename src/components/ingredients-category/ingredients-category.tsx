import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/selectors/constructor-selector';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(
  (
    { title, titleRef, ingredients, onIngredientClick, onAddIngredient },
    ref
  ) => {
    const bun = useSelector(selectConstructorBun);
    const constructorIngredients = useSelector(selectConstructorIngredients);

    const ingredientsCounters = useMemo(() => {
      const counters: { [key: string]: number } = {};
      (constructorIngredients ?? []).forEach((ingredient: TIngredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
      if (bun) counters[bun._id] = 2;
      return counters;
    }, [bun, constructorIngredients]);

    return (
      <IngredientsCategoryUI
        title={title}
        titleRef={titleRef}
        ingredients={ingredients}
        ingredientsCounters={ingredientsCounters}
        onIngredientClick={onIngredientClick}
        onAddIngredient={onAddIngredient}
        ref={ref}
      />
    );
  }
);
