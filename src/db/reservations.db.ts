import { Order } from '../models/order.model';
import { Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { ReservationsService } from '../services/reservations.service';
import { UtilsService } from '../services/utils.service';
import { DB } from './db';

export class ReservationsDB {
  private static TABLE_NAME = 'guest_reservations';

  public static saveReservation = async (branchId: string, sync: Sync) => {
    const reservation: Reservation = ReservationsService.convertSyncToReservation(branchId, sync);

    await DB.getInstance().setItemByKey(this.TABLE_NAME, reservation, {
      primaryKey: 'syncId',
      deniedOverride: false,
    });

    return reservation;
  };

  public static fetchAndMergeReservationsWithOrders = async (orders: Order[]): Promise<Reservation[]> => {
    if (!orders.length) return [];

    const ordersMap = UtilsService.listToMap(orders, (o) => o.syncId);
    const reservations = await DB.getInstance().multiGet<Reservation>(
      this.TABLE_NAME,
      orders.map((o) => ({ syncId: o.syncId }))
    );

    reservations.forEach((r) => {
      if (ordersMap[r.syncId]) {
        ReservationsService.mergeReservationWithOrder(r, ordersMap[r.syncId]!);
      }
    });

    return reservations;
  };

  public static saveMultiReservations = async (reservations: Reservation[]) => {
    if (reservations.length > 0) {
      DB.getInstance().multiWrite(this.TABLE_NAME, reservations);
    }
  };
}
