import { OrderDto } from '../models/order.model';
import { Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { BookingService } from '../services/booking.service';
import { ReservationsService } from '../services/reservations.service';
import { UtilsService } from '../services/utils.service';
import { DB } from './db';

export class ReservationsDB {
  private static TABLE_NAME = 'reservations';

  public static saveReservationFromSync = async (branchId: string, sync: Sync) => {
    const reservation = ReservationsService.syncToReservation(branchId, sync);

    await DB.getInstance().setItemByKey(this.TABLE_NAME, reservation);

    return reservation;
  };

  public static getAndMergeSyncsFromOrders = async (orders: OrderDto[]): Promise<Sync[]> => {
    if (!orders.length) return [];

    const ordersMap = UtilsService.listToMap(orders, (o) => o.syncId);

    const reservations = await DB.getInstance().multiGet<Reservation>(
      this.TABLE_NAME,
      orders.map((o) => ({ syncId: o.syncId }))
    );

    return reservations.map<Sync>((r) => ({
      order: ordersMap[r.syncId],
      reservation: BookingService.updateBookingFromOrder(r.reservation, ordersMap[r.syncId]),
      syncAt: r.syncAt,
      syncId: r.syncId,
    }));
  };

  public static saveMultiReservationsFromSyncs = (branchId: string, syncs: Sync[]) => {
    if (!syncs.length) return;

    DB.getInstance().multiWrite(
      this.TABLE_NAME,
      syncs.map<Reservation>((s) => ReservationsService.syncToReservation(branchId, s))
    );
  };
}
