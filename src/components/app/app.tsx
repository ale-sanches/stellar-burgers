import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import store from '../../services/store';
import { getUser } from '../../services/slices/user-slice';
import '../../index.css';
import styles from './app.module.css';

const AppContent = () => {
  const dispatch = store.dispatch as any;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(getUser());
    } else {
      dispatch({ type: 'user/setAuthChecked', payload: true });
    }
  }, []);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<Feed />} />
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
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
