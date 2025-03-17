import dayjs from 'dayjs';
import { Sync } from '../models/sync.model';
import { DB } from './db';
import { OrderSummery, Reservation, ReservationDto } from '../models/reservation';
import { Order } from '../models/order.model';

export class ReservationsDB {
  private static TABLE_NAME = 'reservations';
  private static RANDOM_PHONE = 'RANDOM';

  private static getOrderSummeryFromSync = (sync: Sync, branchName: string) => {
    if (!sync.params.order) return undefined;

    const order = sync.params.order;
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

  private static syncToReservation = (sync: Sync, branchName: string): Reservation => ({
    syncId: sync.params.syncId,
    branchId: sync.branchId,
    clientPhone: sync.params.reservation?.patron?.phone || this.RANDOM_PHONE,
    clientName: sync.params.reservation?.patron?.name || '',
    orderSummery: this.getOrderSummeryFromSync(sync, branchName),
    ts: dayjs(sync.params.syncAt).valueOf(),
    sync,
  });

  public static setReservation = async (sync: Sync, branchName: string) => {
    const reservation = this.syncToReservation(sync, branchName);

    await DB.getInstance().setItemByKey(ReservationsDB.TABLE_NAME, reservation);

    return reservation;
  };

  public static getReservation = async (syncId: string) => await DB.getInstance().findItemByKey<Reservation>(ReservationsDB.TABLE_NAME, { syncId });

  private static dtoToReservations = (branchId: string, posReservations: ReservationDto[]) => {
    const now = dayjs();
    const date = now.utc().local().format();

    return posReservations.map<Reservation>((r) => {
      const etc = now.add(r.duration, 'minutes');

      return {
        branchId,
        clientName: r.clientName,
        clientPhone: r.clientPhone,
        syncId: r.syncId,
        ts: now.valueOf(),
        sync: {
          action: 'object_sync',
          branchId,
          params: {
            syncId: r.syncId,
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
                name: r.clientName,
                phone: r.clientPhone || this.RANDOM_PHONE,
                note: '',
                status: '',
              },
              reservationId: r.syncId,
              size: r.dinners,
              stage: 'preOrder',
              status: 'seated',
              table: [r.tableNum.toString()],
            },
          },
        },
      };
    });
  };

  public static setReservationsFromPos = async (branchId: string, posReservations: ReservationDto[]) => {
    const reservations = this.dtoToReservations(branchId, posReservations);

    await DB.getInstance().multiWrite(this.TABLE_NAME, reservations);

    return reservations;
  };

  public static mergeOrdersToReservations = async (branchName: string, body: Order[]): Promise<Sync[]> => {
    const ordersMap = body.reduce<Record<string, Order>>((prev, o) => ({ ...prev, [o.syncId]: o }), {});

    const reservations = await DB.getInstance().multiGet<Reservation>(
      this.TABLE_NAME,
      body.map((r) => ({ syncId: r.syncId }))
    );

    const syncs = reservations.map((r) => ({ ...r.sync, params: { ...r.sync.params, order: ordersMap[r.syncId] } }));

    await DB.getInstance().multiWrite(
      this.TABLE_NAME,
      syncs.map((s) => ReservationsDB.syncToReservation(s, branchName))
    );

    return syncs;
  };
}
