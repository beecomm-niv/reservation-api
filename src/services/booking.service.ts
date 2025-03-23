import { OrderDto, OrderStatus } from '../models/order.model';
import { Booking, ReservationStatus } from '../models/sync.model';

export class BookingService {
  private static convertReservationStatusFromOrder = (orderStatus: OrderStatus): ReservationStatus => {
    switch (orderStatus) {
      case OrderStatus.CANCEL:
        return 'canceled';
      default:
        return 'seated';
    }
  };

  public static updateBookingFromOrder = (booking: Booking | null, order: OrderDto | null): Booking | null => {
    if (!booking || !order) return booking;

    const status = this.convertReservationStatusFromOrder(order.orderStatus);

    return { ...booking, size: order.dinnersCount, table: order.tables, stage: order.stage, status };
  };
}
