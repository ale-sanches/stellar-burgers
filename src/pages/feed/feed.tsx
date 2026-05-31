import { FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { FeedUI } from '@ui-pages';
import { Modal, OrderInfo } from '@components';
import { getFeeds } from '../../services/slices/orders-slice';
import {
  selectOrders,
  selectOrdersLoading,
  selectTotal,
  selectTotalToday
} from '../../services/selectors/orders-selector';

export const Feed: FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const total = useSelector(selectTotal);
  const totalToday = useSelector(selectTotalToday);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  const handleCloseModal = () => {
    navigate('/feed');
  };

  if (isLoading && !orders.length) {
    return <p>Загрузка...</p>;
  }

  return (
    <>
      <FeedUI
        orders={orders}
        handleGetFeeds={handleGetFeeds}
        total={total}
        totalToday={totalToday}
      />
      {number && (
        <Modal title='Детали заказа' onClose={handleCloseModal}>
          <OrderInfo />
        </Modal>
      )}
    </>
  );
};
