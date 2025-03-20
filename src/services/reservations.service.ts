import dayjs from 'dayjs';
import { Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { OrderService } from './order.service';

export class ReservationsService {
  private static readonly RANDOM_PHONE = '0000000000';

  private static convertPhone = (phone: string) => phone.replace('+972', '0');

  public static syncToReservation = (branchId: string, sync: Sync): Reservation => ({
    branchId,
    syncId: sync.syncId,
    syncAt: sync.syncAt,
    ts: dayjs(sync.syncAt).valueOf(),
    clientPhone: this.convertPhone(sync.reservation?.patron?.phone || this.RANDOM_PHONE),
    reservation: sync.reservation,
    order: OrderService.dtoToOrder(sync.order),
  });
}
