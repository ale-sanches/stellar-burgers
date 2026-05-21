import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { TNewOrderResponse } from '@api';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/selectors/constructor-selector';
import { selectUser } from '../../services/selectors/user-selector';
import {
  selectOrdersLoading,
  selectCurrentOrder
} from '../../services/selectors/orders-selector';
import {
  addIngredient,
  setBun,
  clearConstructor
} from '../../services/slices/constructor-slice';
import { createOrder } from '../../services/slices/orders-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(selectConstructorBun) ?? null;
  const ingredients = useSelector(selectConstructorIngredients) ?? [];
  const user = useSelector(selectUser);
  const orderRequest = useSelector(selectOrdersLoading);
  const orderModalData = useSelector(selectCurrentOrder) as
    | TNewOrderResponse['order']
    | null;

  const constructorItems = {
    bun: bun,
    ingredients: ingredients ?? []
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };

  const handleAddIngredient = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      dispatch(setBun(ingredient));
    } else {
      dispatch(addIngredient(ingredient));
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients?.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ) || 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onAddIngredient={handleAddIngredient}
    />
  );
};
