import dayjs from 'dayjs';
import { Sync } from '../models/sync.model';
import { DB } from './db';
import { OrderSummery, Reservation } from '../models/reservation';

export class ReservationsDB extends DB {
  constructor() {
    super('reservations');
  }

  private getOrderSummeryFromSync = (sync: Sync, branchName: string) => {
    if (!sync.params.order) return undefined;

    const order = sync.params.order;
    const summery: OrderSummery = {
      branchName,
      clientName: sync.params.reservation.patron.name,
      table: order.tableInfo.tableNum,
      dinners: order.tableInfo.dinners,
      discount: order.tableInfo.discount,
      service: order.tableInfo.service,
      totalOrder: 0,
    };

    order.dishes.forEach((d) => {
      summery.totalOrder += d.totalPrice;
      d.toppings.forEach((t) => (summery.totalOrder += t.totalPrice));
    });

    return summery;
  };

  public setReservation = async (sync: Sync, branchName: string) => {
    // TODO: set branchId to beecommBranch
    const reservation: Reservation = {
      syncId: sync.params.syncId,
      branchId: sync.branchId,
      clientPhone: sync.params.reservation.patron.phone.replace('+', ''),
      orderSummery: this.getOrderSummeryFromSync(sync, branchName),
      ts: dayjs(sync.params.syncAt).valueOf(),
      sync,
    };

    await this.setItemByKey(reservation);
  };

  public getReservation = async (syncId: string) => await this.findItemByKey<Reservation>({ syncId });

  public queryReservations = async (fullFetch: boolean, clientPhone: string, branchId?: string): Promise<Reservation[]> => {
    const condition = 'clientPhone = :phone' + (branchId ? ' And branchId = :branch' : '');
    const values: Record<string, any> = {
      ':phone': clientPhone,
    };

    if (branchId) {
      values[':branch'] = branchId;
    }

    const projection: string | undefined = fullFetch ? undefined : 'syncId, branchId, orderSummery, ts';

    const response = await this.db
      .query({
        TableName: this.tableName,
        IndexName: 'findByClient',
        KeyConditionExpression: condition,
        ExpressionAttributeValues: values,
        ProjectionExpression: projection,
      })
      .promise();

    return (response.Items || []) as Reservation[];
  };
}
