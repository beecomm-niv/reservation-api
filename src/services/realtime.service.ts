import { database } from 'firebase-admin';
import { OrderDto, OrderStatus } from '../models/order.model';
import { Booking, Sync } from '../models/sync.model';

export class RealTimeService {
  private static readonly RESERVATIONS_PATH = 'reservations';
  private static readonly ORDERS_PATH = 'orders';

  public static setReservations = async (branchId: string, syncs: Sync[], init?: boolean) => {
    const updates: Record<string, Booking | OrderDto | null> = {};

    syncs.forEach((s) => {
      if (s.reservation) {
        updates[`/${this.RESERVATIONS_PATH}/${s.syncId}`] = s.reservation;
      }

      if (s.order) {
        const isClosed = s.order.orderStatus === OrderStatus.CANCEL || s.order.orderStatus === OrderStatus.CLOSED;
        updates[`/${this.ORDERS_PATH}/${s.syncId}`] = isClosed ? null : s.order;
      }
    });

    if (init) {
      await database().ref(`/${branchId}/${this.ORDERS_PATH}`).remove();
    }

    if (Object.keys(updates).length) {
      database().ref(branchId).update(updates);
    }
  };
}
