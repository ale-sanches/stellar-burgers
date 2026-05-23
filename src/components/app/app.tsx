import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Ingredients,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader } from '@components';
import { ProtectedRoute } from '@components/protected-route';
import { Modal } from '@components/modal';
import { OrderInfo } from '@components/order-info';
import { IngredientDetails } from '@components/ingredient-details';
import { getCookie } from '../../utils/cookie';
import store, { AppDispatch } from '../../services/store';
import { getUser, setAuthChecked } from '../../services/slices/user-slice';
import { getIngredients } from '../../services/slices/ingredients-slice';
import '../../index.css';
import styles from './app.module.css';

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleModalClose = () => {
    const locationState = location.state as { background?: Location };
    const background = locationState?.background;
    if (background) {
      navigate(background.pathname + background.search, { replace: true });
    } else {
      navigate(-1);
    }
  };

  const locationState = location.state as { background?: Location };
  const background = locationState?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <p
                className={`text text_type_digits-default ${styles.detailHeader}`}
              >
                #
              </p>
              <OrderInfo />
            </div>
          }
        />
        <Route path='/ingredients/:id' element={<Ingredients />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute anonymous>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute anonymous>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute anonymous>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute anonymous>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <div className={styles.detailPageWrap}>
                <p
                  className={`text text_type_digits-default ${styles.detailHeader}`}
                >
                  #
                </p>
                <OrderInfo />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal onClose={handleModalClose} title='Детали ингредиента'>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal onClose={handleModalClose} title=''>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal onClose={handleModalClose} title=''>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const AppContent = () => {
  const dispatch: AppDispatch = store.dispatch;

  useEffect(() => {
    const token = getCookie('accessToken');
    if (token) {
      dispatch(getUser());
    } else {
      dispatch(setAuthChecked(true));
    }
    dispatch(getIngredients());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
