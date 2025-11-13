import { Log } from '../models/log.model';
import { DB } from './db';

export class LogsDb {
  private static TABLE_NAME = 'guest_logs';

  public static setLog = (log: Log) => {
    DB.getInstance()
      .setItemByKey(LogsDb.TABLE_NAME, log)
      .catch(() => {});
  };
}
