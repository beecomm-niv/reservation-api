import { Sync } from '../models/sync.model';
import { DB } from './db';
import { Reservation } from '../models/reservation';
import { Order } from '../models/order.model';
import { ReservationsService } from '../services/reservations.service';

export class ReservationsDB {
  private static TABLE_NAME = 'reservations';

  public static setReservation = async (branchId: string, sync: Sync, branchName: string) => {
    const reservation = ReservationsService.syncToReservation(branchId, sync, branchName);

    await DB.getInstance().setItemByKey(ReservationsDB.TABLE_NAME, reservation);

    return reservation;
  };

  public static getReservation = async (syncId: string) => await DB.getInstance().findItemByKey<Reservation>(ReservationsDB.TABLE_NAME, { syncId });

  public static getReservationsFromOrders = async (branchName: string, orders: Order[]): Promise<Reservation[]> => {
    const ordersMap: Partial<Record<string, Order>> = Object.assign({}, ...orders.map<Record<string, Order>>((o) => ({ [o.syncId]: o })));

    const dbReservations = await DB.getInstance().multiGet<Reservation>(
      this.TABLE_NAME,
      orders.map((r) => ({ syncId: r.syncId }))
    );

    return dbReservations.map<Reservation>((r) =>
      ReservationsService.syncToReservation(r.branchId, { syncAt: r.syncAt, syncId: r.syncId, order: ordersMap[r.syncId] || null, reservation: r.reservation }, branchName)
    );
  };

  public static writeMultipleReservations = async (reservations: Reservation[]) => await DB.getInstance().multiWrite(this.TABLE_NAME, reservations);
}
