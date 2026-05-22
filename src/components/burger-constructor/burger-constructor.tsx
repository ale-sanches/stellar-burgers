import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorBun,
  selectConstructorIngredients
} from '../../services/selectors/constructor-selector';
import { selectUser } from '../../services/selectors/user-selector';
import {
  selectOrderCreating,
  selectCurrentOrder
} from '../../services/selectors/orders-selector';
import {
  addIngredient,
  setBun,
  clearConstructor
} from '../../services/slices/constructor-slice';
import {
  createOrder,
  clearCurrentOrder
} from '../../services/slices/orders-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(selectConstructorBun) ?? null;
  const ingredients = useSelector(selectConstructorIngredients) ?? [];
  const user = useSelector(selectUser);
  const orderRequest = useSelector(selectOrderCreating);
  const orderModalData = useSelector(selectCurrentOrder) as TOrder | null;

  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

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
    dispatch(clearCurrentOrder());
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
