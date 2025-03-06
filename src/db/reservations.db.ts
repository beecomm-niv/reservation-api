import { Reservation } from '../models/Reservation.model';
import { Sync } from '../models/sync.model';
import { DB } from './db';

export interface SyncQureyRequest {
  branchId?: string;
  clientPhone?: string;
}

export class ReservationsDB extends DB {
  constructor() {
    super('reservations');
  }

  public setReservation = async (sync: Sync) => {
    // TODO: set branchId to beecommBranch + calc order  summery from order
    const reservation: Reservation = {
      syncId: sync.params.syncId,
      branchId: sync.branchId,
      clientPhone: sync.params.reservation.patron.phone,
      orderSummery: {
        branchName: '',
        clientName: sync.params.reservation.patron.name,
        dinners: 0,
        discount: 0,
        service: 0,
        totalOrder: 0,
      },

      ts: 0,
      sync,
    };

    await this.setItemByKey(reservation);
  };

  public getSync = async (syncId: string) => await this.findItemByKey<Sync>({ syncId });
}
