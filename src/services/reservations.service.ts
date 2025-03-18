import dayjs from 'dayjs';
import { Order } from '../models/order.model';
import { OrderSummery, Reservation, ReservationDto } from '../models/reservation';
import { SyncDto } from '../models/sync.model';

export class ReservationsService {
  private static RANDOM_PHONE = '0000000000';
  private static RANDOM_NAME = 'RANDOM';

  private static convertPhoneNumber = (phone: string) => phone.replace('+972', '0');

  public static orderToSummery = (order: Order | undefined, branchName: string): OrderSummery | undefined => {
    if (!order) return undefined;

    const summery: OrderSummery = {
      branchName,
      orderId: order.orderId,
      table: order.tableNum,
      dinners: order.dinners,
      discount: order.discount,
      service: order.service,
      totalOrder: 0,
    };

    order.dishes.forEach((d) => {
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

  public static syncToReservation = (sync: SyncDto, branchName: string): Reservation => {
    const clientPhone = this.convertPhoneNumber(sync.params.reservation?.patron?.phone || this.RANDOM_PHONE);
    const clientName = sync.params.reservation?.patron?.name || this.RANDOM_NAME;

    return {
      syncId: sync.params.syncId,
      branchId: sync.branchId,
      clientPhone,
      clientName,
      orderSummery: this.orderToSummery(sync.params.order, branchName),
      ts: dayjs(sync.params.syncAt).valueOf(),
      syncAt: sync.params.syncAt,
      reservation: sync.params.reservation,
      order: sync.params.order,
    };
  };

  public static dtoToReservations = (branchId: string, posReservations: ReservationDto[]) => {
    const now = dayjs();
    const date = now.utc().local().format();

    return posReservations.map<Reservation>((r) => {
      const etc = now.add(r.duration, 'minutes');
      const phone = this.convertPhoneNumber(r.clientPhone || this.RANDOM_PHONE);
      const name = r.clientName || this.RANDOM_NAME;

      return {
        branchId,
        clientName: name,
        clientPhone: phone,
        syncId: r.syncId,
        ts: now.valueOf(),
        syncAt: date,
        reservation: {
          comment: '',
          createdAt: date,
          createdBy: 'beecomm.pos',
          creditcardStatus: 'verified',
          duration: r.duration,
          expectedDate: etc.format('YYYYMMDD'),
          expectedTime: etc.format('HHmm'),
          hasPackage: false,
          lastModified: now.valueOf(),
          patron: {
            name,
            phone,
            note: '',
            status: 'member',
          },
          reservationId: r.syncId,
          size: r.dinners,
          stage: 'preOrder',
          status: 'seated',
          table: [r.tableNum.toString()],
        },
      };
    });
  };
}
