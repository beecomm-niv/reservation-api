import { Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { ReservationsService } from '../services/reservations.service';
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
}
