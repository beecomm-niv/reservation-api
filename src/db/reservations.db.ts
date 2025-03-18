import { Sync } from '../models/sync.model';
import { DB } from './db';
import { Reservation, ReservationDto } from '../models/reservation';
import { Order } from '../models/order.model';
import { ReservationsService } from '../services/reservations.service';

export class ReservationsDB {
  private static TABLE_NAME = 'reservations';

  public static setReservation = async (sync: Sync, branchName: string) => {
    const reservation = ReservationsService.syncToReservation(sync, branchName);

    await DB.getInstance().setItemByKey(ReservationsDB.TABLE_NAME, reservation);

    return reservation;
  };

  public static getReservation = async (syncId: string) => await DB.getInstance().findItemByKey<Reservation>(ReservationsDB.TABLE_NAME, { syncId });

  public static setReservationsFromPos = async (branchId: string, posReservations: ReservationDto[]) => {
    const reservations = ReservationsService.dtoToReservations(branchId, posReservations);

    await DB.getInstance().multiWrite(this.TABLE_NAME, reservations);

    return reservations;
  };

  public static mergeOrdersToReservations = async (branchName: string, body: Order[]): Promise<Sync[]> => {
    const ordersMap = body.reduce<Record<string, Order>>((prev, o) => ({ ...prev, [o.syncId]: o }), {});

    const reservations = await DB.getInstance().multiGet<Reservation>(
      this.TABLE_NAME,
      body.map((r) => ({ syncId: r.syncId }))
    );

    const syncs = reservations.map<Sync>((r) => ({ ...r.sync, params: { ...r.sync.params, order: ordersMap[r.syncId] } }));

    await DB.getInstance().multiWrite(
      this.TABLE_NAME,
      syncs.map((s) => ReservationsService.syncToReservation(s, branchName))
    );

    return syncs;
  };
}
