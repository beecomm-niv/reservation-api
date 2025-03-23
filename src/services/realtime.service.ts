import { database } from 'firebase-admin';
import { OrderDto, OrderStatus } from '../models/order.model';

export class RealTimeService {
  public static setOrders = async (branchId: string, orders: OrderDto[], init: boolean) => {
    const data: Record<string, OrderDto | null> = {};

    orders.forEach((o) => {
      if (o.orderStatus === OrderStatus.CANCEL || o.orderStatus === OrderStatus.CLOSED) {
        data[o.syncId] = null;
      } else {
        data[o.syncId] = o;
      }
    });

    const path = `${branchId}/orders/`;

    if (init) {
      await database().ref(path).set(data);
    } else {
      await database().ref(path).update(data);
    }
  };
}
