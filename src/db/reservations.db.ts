import { Reservation } from '../models/Reservation.model';
import { Sync } from '../models/sync.model';
import { DB } from './db';

export interface SyncQureyRequest {
  branchId?: string;
  clientPhone?: string;
}

export class ReservationsDB extends DB {
  constructor() {
    super('reservations');
  }

  public setReservation = async (sync: Sync) => {
    const reservation: Reservation = {
      branchId: sync.branchId,
      branchName: 'סניף בדיקות',
      clientName: sync.params.reservation.patron.name,
      clientPhone: sync.params.reservation.patron.phone,
      syncId: sync.params.syncId,
      sync: sync,
    };

    await this.db
      .put({
        TableName: this.tableName,
        Item: reservation,
      })
      .promise();
  };

  public getSync = async (syncId: string) => {
    const data = await this.db
      .get({
        TableName: this.tableName,
        Key: {
          syncId,
        },
      })
      .promise();

    return data.Item as Sync | undefined;
  };

  private queryByBranchAndPhone = async (branchId: string, clientPhone: string) => {
    const response = await this.db
      .query({
        TableName: this.tableName,
        IndexName: 'branchId-clientPhone-index',
        KeyConditionExpression: 'branchId = :branch AND clientPhone = :phone',
        ExpressionAttributeValues: {
          ':branch': branchId,
          ':phone': clientPhone,
        },
      })
      .promise();

    return response.Items as Sync[];
  };

  private queryByBranchId = async (branchId: string) => {
    const response = await this.db
      .query({
        TableName: this.tableName,
        IndexName: 'branchId-clientPhone-index',
        KeyConditionExpression: 'branchId = :branch',
        ExpressionAttributeValues: {
          ':branch': branchId,
        },
      })
      .promise();

    return response.Items as Sync[];
  };

  private queryByPhone = async (clientPhone: string) => {
    const response = await this.db
      .query({
        TableName: this.tableName,
        IndexName: 'clientPhone-index',
        KeyConditionExpression: 'clientPhone = :phone',
        ExpressionAttributeValues: {
          ':phone': clientPhone,
        },
      })
      .promise();

    return response.Items as Sync[];
  };

  public querySync = async (q: SyncQureyRequest) => {
    if (q.branchId && q.clientPhone) {
      return await this.queryByBranchAndPhone(q.branchId, q.clientPhone);
    } else if (q.branchId) {
      return await this.queryByBranchId(q.branchId);
    } else if (q.clientPhone) {
      return await this.queryByPhone(q.clientPhone);
    }

    return [];
  };
}
