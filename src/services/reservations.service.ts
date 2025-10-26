import dayjs from 'dayjs';
import { Reservation, ReservationDto } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { OrderService } from './order.service';
import { ErrorResponse } from '../models/error-response.model';

export class ReservationsService {
  public static convertSyncToReservation = (branchId: string, sync: Sync): Reservation => ({
    branchId: branchId,
    clientName: sync.reservation.patron.name,
    clientPhone: sync.reservation.patron.phone,
    order: sync.order,
    reservation: sync.reservation,
    syncAt: sync.syncAt,
    syncId: sync.syncId,
    totalOrder: OrderService.getOrderTotalFromDishes(sync.order),
    dinners: sync.reservation.size,
    ts: dayjs(sync.syncAt).valueOf(),
  });

  public static convertSyncToReservationDto = (sync: Sync): ReservationDto => {
    const { reservation } = sync;

    if (!reservation) {
      throw ErrorResponse.MissingRequiredParams();
    }

    if (!reservation.table.length) {
      throw ErrorResponse.InvalidTablesRequest();
    }

    return {
      clientName: reservation.patron.name,
      clientPhone: reservation.patron.phone,
      comment: reservation.comment,
      dinnersCount: reservation.size,
      duration: reservation.duration,
      expectedDate: this.convertToDate(reservation.expectedDate, reservation.expectedTime),
      patronStatus: reservation.patron.status,
      stage: reservation.stage,
      status: reservation.status,
      syncId: sync.syncId,
      tableNum: +reservation.table.sort((a, b) => a.localeCompare(b))[0],
    };
  };

  private static convertToDate = (expectedDate: string, expectedTime: string) => {
    const year = expectedDate.slice(0, 4);
    const month = expectedDate.slice(4, 6);
    const day = expectedDate.slice(6, 8);

    const hours = expectedTime.slice(0, 2);
    const minutes = expectedTime.slice(2, 4);

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
}
