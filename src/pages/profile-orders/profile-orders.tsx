import { FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { Modal, OrderInfo } from '@components';
import { getUserOrders } from '../../services/slices/orders-slice';
import {
  selectOrders,
  selectOrdersLoading
} from '../../services/selectors/orders-selector';

export const ProfileOrders: FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate('/profile/orders');
  };

  return (
    <>
      <ProfileOrdersUI orders={orders} isLoading={isLoading} />
      {number && (
        <Modal title='Детали заказа' onClose={handleCloseModal}>
          <OrderInfo />
        </Modal>
      )}
    </>
  );
};
