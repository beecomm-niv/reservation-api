import dayjs from 'dayjs';
import { Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { OrderDto, OrderInfo } from '../models/order.model';
import { BookingService } from './booking.service';

export class ReservationsService {
  private static readonly RANDOM_PHONE = '0000000000';

  private static convertPhone = (phone: string) => phone.replace('+972', '0');

  private static orderDtoToInfo = (order: OrderDto | null): OrderInfo | null => {
    if (!order) return null;

    return {
      comment: order.comment,
      discount: order.discount,
      fromDate: order.fromDate,
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      service: order.service,
      toDate: order.toDate,
      totalOrder: order.totalOrder,
      waitress: order.waitress,
    };
  };

  public static syncToReservation = (branchId: string, sync: Sync): Reservation => ({
    branchId,
    syncId: sync.syncId,
    syncAt: sync.syncAt,
    ts: dayjs(sync.syncAt).valueOf(),
    clientPhone: this.convertPhone(sync.reservation?.patron?.phone || this.RANDOM_PHONE),
    reservation: BookingService.updateBookingFromOrder(sync.reservation, sync.order),
    orderInfo: this.orderDtoToInfo(sync.order),
    dishes: sync.order?.dishes || null,
  });
}
