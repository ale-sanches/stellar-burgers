import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectIsAuthenticated
} from '../../services/selectors/user-selector';

interface ProtectedRouteProps {
  children: ReactNode;
  anonymous?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  anonymous = false
}) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthChecked) {
    return null;
  }

  if (anonymous) {
    return isAuthenticated ? <Navigate to='/' replace /> : <>{children}</>;
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};
