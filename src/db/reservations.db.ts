import dayjs from 'dayjs';
import { Sync } from '../models/sync.model';
import { DB } from './db';
import { OrderSummery, Reservation, ReservationDto } from '../models/reservation';
import { Order } from '../models/order.model';

export class ReservationsDB {
  private static TABLE_NAME = 'reservations';

  private static getOrderSummeryFromSync = (sync: Sync, branchName: string) => {
    if (!sync.params.order) return undefined;

    const order = sync.params.order;
    const summery: OrderSummery = {
      branchName,
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
    clientPhone: sync.params.reservation.patron.phone,
    clientName: sync.params.reservation.patron.name,
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

  // public static queryReservationsByClientPhone = async (fullFetch: boolean, clientPhone: string, branchId?: string): Promise<Reservation[]> => {
  //   const condition = 'clientPhone = :phone' + (branchId ? ' And branchId = :branch' : '');
  //   const values: Record<string, any> = {
  //     ':phone': clientPhone,
  //   };

  //   if (branchId) {
  //     values[':branch'] = branchId;
  //   }

  //   const projection: string | undefined = fullFetch ? undefined : 'syncId, clientName, branchId, orderSummery, ts';

  //   const response = await DB.getInstance()
  //     .client.query({
  //       TableName: ReservationsDB.TABLE_NAME,
  //       IndexName: 'findReservationsByClientPhone',
  //       KeyConditionExpression: condition,
  //       ExpressionAttributeValues: values,
  //       ProjectionExpression: projection,
  //     })
  //     .promise();

  //   return (response.Items || []) as Reservation[];
  // };

  // public static queryReservationsByBranch = async (branchId: string): Promise<Reservation[]> => {
  //   const response = await DB.getInstance()
  //     .client.query({
  //       TableName: ReservationsDB.TABLE_NAME,
  //       IndexName: 'findReservationsByDate', // findReservationsByBranch
  //       KeyConditionExpression: 'branchId = :branch',
  //       ExpressionAttributeValues: {
  //         ':branch': branchId,
  //       },
  //     })
  //     .promise();

  //   return (response.Items || []) as Reservation[];
  // };

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
              createdBy: 'ניב כץ', //TODO: weitress name !
              creditcardStatus: '',
              duration: r.duration,
              expectedDate: etc.format('YYYYMMDD'),
              expectedTime: etc.format('HHmm'),
              hasPackage: false,
              lastModified: now.valueOf(),
              patron: {
                name: r.clientName,
                phone: r.clientPhone || 'RANDOM',
                note: '',
                status: '',
              },
              reservationId: r.syncId,
              size: r.dinners,
              stage: '',
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
