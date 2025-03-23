import dayjs from 'dayjs';
import { OrderDto, OrderStatus } from '../models/order.model';
import { Booking, ReservationStatus, Sync } from '../models/sync.model';
import { Reservation } from '../models/reservation';
import { UtilsService } from './utils.service';

export class SyncService {
  private static convertReservationStatusFromOrder = (orderStatus: OrderStatus): ReservationStatus => {
    switch (orderStatus) {
      case OrderStatus.CANCEL:
        return 'canceled';
      default:
        return 'seated';
    }
  };

  private static updateBookingFromOrder = (booking: Booking | null, order: OrderDto | null): Booking | null => {
    if (!booking || !order) return booking;

    const status = this.convertReservationStatusFromOrder(order.orderStatus);

    return { ...booking, size: order.dinnersCount, table: order.tables, stage: order.stage, status };
  };

  public static getSyncFromOrdersAndReservations = (reservations: Reservation[], activeOrders: OrderDto[], newOrders: OrderDto[]): Sync[] => {
    const ordersMap = UtilsService.listToMap(activeOrders, (o) => o.syncId);

    const newSync: Sync[] = newOrders.map<Sync>((order) => ({
      order,
      reservation: null,
      syncAt: dayjs().utc().format(),
      syncId: order.syncId,
    }));

    const activeSyncs = reservations.map<Sync>((r) => ({
      syncAt: r.syncAt,
      syncId: r.syncId,
      order: ordersMap[r.syncId],
      reservation: this.updateBookingFromOrder(r.reservation, ordersMap[r.syncId]),
    }));

    return newSync.concat(activeSyncs);
  };
}
