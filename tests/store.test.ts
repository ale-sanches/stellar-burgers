import { rootReducer } from '../src/services/store';

import ingredientsReducer from '../src/services/slices/ingredients-slice';
import ordersReducer from '../src/services/slices/orders-slice';
import userReducer from '../src/services/slices/user-slice';
import constructorReducer from '../src/services/slices/constructor-slice';

describe('rootReducer', () => {
  it('initializes the state correctly', () => {
    const initAction = { type: '@@INIT' };

    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      orders: ordersReducer(undefined, initAction),
      user: userReducer(undefined, initAction),
      burgerConstructor: constructorReducer(undefined, initAction)
    });
  });

  it('handles unknown action correctly', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, unknownAction),
      orders: ordersReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction),
      burgerConstructor: constructorReducer(undefined, unknownAction)
    });
  });
});
