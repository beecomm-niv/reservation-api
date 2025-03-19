import dayjs from 'dayjs';
import { Order } from '../models/order.model';
import { OrderSummery, Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';

export class ReservationsService {
  private static RANDOM_PHONE = '0000000000';
  private static RANDOM_NAME = 'RANDOM';

  private static convertPhoneNumber = (phone: string) => phone.replace('+972', '0');

  public static orderToSummery = (order: Order | null, branchName: string): OrderSummery | undefined => {
    if (!order) return undefined;

    const summery: OrderSummery = {
      branchName,
      orderId: order.orderId,
      discount: order.discount,
      service: order.service,
      totalOrder: 0,
    };

    order.dishes?.forEach((d) => {
      if (!d.isCancel) {
        summery.totalOrder += d.totalPrice;
      }

      d.toppings.forEach((t) => {
        if (!t.isCancel) {
          summery.totalOrder += t.totalPrice;
        }
      });
    });

    return summery;
  };

  public static syncToReservation = (branchId: string, sync: Sync, branchName: string): Reservation => {
    const clientPhone = this.convertPhoneNumber(sync.reservation?.patron?.phone || this.RANDOM_PHONE);
    const clientName = sync.reservation?.patron?.name || this.RANDOM_NAME;

    const reservation: Reservation = {
      syncId: sync.syncId,
      branchId,
      clientPhone,
      clientName,
      ts: dayjs(sync.syncAt).valueOf(),
      syncAt: sync.syncAt,
      reservation: sync.reservation,
      order: sync.order,
    };

    if (reservation.order && reservation.reservation) {
      reservation.reservation.size = reservation.order.dinnersCount;
      reservation.reservation.table = reservation.order.tables;
    }

    reservation.orderSummery = this.orderToSummery(sync.order, branchName);

    return reservation;
  };
}
