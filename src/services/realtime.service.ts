import { database } from 'firebase-admin';
import { Order } from '../models/order.model';

export class RealTimeService {
  public static setReservations = async (branchId: string, orders: Order[], removed: number[], init?: boolean) => {
    if (!init && !orders.length && !removed.length) return;

    const data: Record<string, Order | null> = Object.assign({}, ...orders.map<Record<number, Order>>((o) => ({ [o.orderId]: o })));

    removed.forEach((r) => (data[r] = null));

    const path = `/${branchId}/orders`;

    if (init) {
      await database().ref(path).set(data);
    } else {
      await database().ref(path).update(data);
    }
  };
}
