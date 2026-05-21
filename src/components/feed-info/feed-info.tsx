import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export type FeedInfoProps = {
  orders: TOrder[];
  total?: number;
  totalToday?: number;
};

export const FeedInfo: FC<FeedInfoProps> = ({ orders, total, totalToday }) => {
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total: total ?? 0, totalToday: totalToday ?? 0 }}
    />
  );
};
