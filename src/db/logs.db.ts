import { v4 } from 'uuid';
import { Log, LogsSevierity } from '../models/log.model';
import dayjs from 'dayjs';
import { DB } from './db';

export class LogsDb {
  private static TABLE_NAME = 'guest_logs';

  public static saveLog = async (searchKey: string, severity: LogsSevierity, user: string, payload: any, message?: string) => {
    const id = v4();

    const data: Log = {
      id,
      searchKey,
      payload,
      severity,
      ts: dayjs().valueOf(),
      user,
      message,
    };

    await DB.getInstance().setItemByKey(this.TABLE_NAME, data, {
      primaryKey: 'id',
      deniedOverride: false,
    });

    return id;
  };

  public static updateError = async (logId: string, message: string) => {
    await DB.getInstance().update<Log>(this.TABLE_NAME, 'id', logId, { message, severity: 'ERROR' }, ['id']);
  };
}
