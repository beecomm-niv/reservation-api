import { database } from 'firebase-admin';
import { OrderDto } from '../models/order.model';

export class RealTimeService {
  public static setOrders = async (branchId: string, orders: OrderDto[], removed: number[], init: boolean) => {
    const data: Record<number, OrderDto | null> = Object.assign({}, ...orders.map<Record<number, OrderDto>>((o) => ({ [o.orderId]: o })));
    removed.forEach((i) => (data[i] = null));

    const path = `${branchId}/orders/`;

    if (init) {
      await database().ref(path).set(data);
    } else {
      await database().ref(path).update(data);
    }
  };
}
