import dayjs from 'dayjs';
import { Reservation } from '../models/reservation.model';
import { Sync } from '../models/sync.model';
import { DB } from './db';

export class ReservationsDB extends DB {
  constructor() {
    super('reservations');
  }

  public setReservation = async (sync: Sync) => {
    // TODO: set branchId to beecommBranch + calc order  summery from order
    const reservation: Reservation = {
      syncId: sync.params.syncId,
      branchId: sync.branchId,
      clientPhone: sync.params.reservation.patron.phone.replace('+', ''),
      orderSummery: {
        branchName: '',
        clientName: sync.params.reservation.patron.name,
        dinners: 0,
        discount: 0,
        service: 0,
        totalOrder: 0,
      },

      ts: dayjs(sync.params.syncAt).valueOf(),
      sync,
    };

    await this.setItemByKey(reservation);
  };

  public getSync = async (syncId: string) => await this.findItemByKey<Sync>({ syncId });

  public querySync = async (fullFetch: boolean, clientPhone: string, branchId?: string): Promise<Sync[]> => {
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

    return (response.Items || []) as Sync[];
  };
}
