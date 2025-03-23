import { OrderDto } from '../models/order.model';
import { Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { OrderService } from '../services/order.service';
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

  public static getReservations = async (syncs: string[]) =>
    await DB.getInstance().multiGet<Reservation>(
      this.TABLE_NAME,
      syncs.map((syncId) => ({ syncId }))
    );

  public static mergeAndSaveOrders = (reservations: Reservation[], orders: OrderDto[]) => {
    const ordersMap = UtilsService.listToMap(orders, (o) => o.syncId);
    const data = reservations.map<Reservation>((r) => ({ ...r, order: OrderService.dtoToOrder(ordersMap[r.syncId]) }));

    DB.getInstance().multiWrite(this.TABLE_NAME, data);
  };
}
