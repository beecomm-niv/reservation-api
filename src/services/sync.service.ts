import dayjs from 'dayjs';
import { OrderDto } from '../models/order.model';
import { Sync } from '../models/sync.model';
import { Reservation } from '../models/reservation';

export class SyncService {
  public static getSyncFromOrdersAndReservations = async (reservations: Reservation[], activeOrders: OrderDto[], newOrders: OrderDto[]): Promise<Sync[]> => {
    const ordersMap: Record<string, OrderDto> = Object.assign({}, ...activeOrders.map<Record<string, OrderDto>>((o) => ({ [o.syncId]: o })));

    const newSync: Sync[] = newOrders.map<Sync>((order) => ({
      order,
      reservation: null,
      syncAt: dayjs().utc().format(),
      syncId: order.syncId,
    }));

    const activeSyncs = reservations.map<Sync>((r) => ({
      order: ordersMap[r.syncId],
      reservation: r.reservation,
      syncAt: r.syncAt,
      syncId: r.syncId,
    }));

    return newSync.concat(activeSyncs);
  };
}
