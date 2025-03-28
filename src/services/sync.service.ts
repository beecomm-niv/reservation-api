import dayjs from 'dayjs';
import { OrderDto } from '../models/order.model';
import { Sync } from '../models/sync.model';

export class SyncService {
  public static syncFromNewOrders = (orders: OrderDto[]): Sync[] =>
    orders.map<Sync>((order) => ({
      syncId: order.syncId,
      syncAt: dayjs().utc().format(),
      reservation: null,
      order,
    }));
}
