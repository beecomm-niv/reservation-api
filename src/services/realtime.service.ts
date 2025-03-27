import { database } from 'firebase-admin';
import { OrderDto, OrderStatus } from '../models/order.model';
import { Sync } from '../models/sync.model';

export class RealTimeService {
  public static setOrders = (branchId: string, orders: OrderDto[], init: boolean) => {
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
      database().ref(path).set(data);
    } else {
      database().ref(path).update(data);
    }
  };

  public static endReservations = (branchId: string, orders: OrderDto[]) => {
    const data: Record<string, null> = {};
    orders.filter((o) => o.orderStatus === OrderStatus.CLOSED || o.orderStatus === OrderStatus.CANCEL).forEach((o) => (data[o.syncId] = null));

    if (!Object.keys(data).length) return;

    const path = `${branchId}/reservations/`;
    database().ref(path).update(data);
  };

  public static setReservation = (branchId: string, sync: Sync) => {
    const path = `${branchId}/reservations/${sync.syncId}`;

    if (sync.reservation?.status === 'canceled') {
      database().ref(path).remove();
    } else {
      database().ref(path).set(sync);
    }
  };
}
