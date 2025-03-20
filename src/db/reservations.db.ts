import { OrderDto } from '../models/order.model';
import { Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { OrderService } from '../services/order.service';
import { ReservationsService } from '../services/reservations.service';
import { DB } from './db';

export class ReservationsDB {
  private static TABLE_NAME = 'reservations';

  public static saveReservationFromSync = async (branchId: string, sync: Sync) => {
    const reservation = ReservationsService.syncToReservation(branchId, sync);

    await DB.getInstance().setItemByKey(this.TABLE_NAME, reservation);

    return reservation;
  };

  public static getReservations = async (syncs: string[]): Promise<Reservation[]> => {
    if (!syncs.length) return [];

    return await DB.getInstance().multiGet<Reservation>(
      this.TABLE_NAME,
      syncs.map((syncId) => ({ syncId }))
    );
  };

  public static finishOrders = async (reservations: Reservation[], orders: OrderDto[]) => {
    const ordersMap: Record<string, OrderDto> = Object.assign({}, ...orders.map<Record<string, OrderDto>>((o) => ({ [o.syncId]: o })));

    await DB.getInstance().multiWrite<Reservation>(
      this.TABLE_NAME,
      reservations.map((r) => ({ ...r, order: OrderService.dtoToOrder(ordersMap[r.syncId]) }))
    );
  };
}
