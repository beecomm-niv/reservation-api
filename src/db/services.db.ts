import { ErrorResponse } from '../models/error-response.model';
import { ACCESS } from '../models/jwt-payload.model';
import { Service } from '../models/service.model';
import { DB } from './db';
import crypto from 'crypto';

export class ServicesDB {
  private static TABLE_NAME = 'guest_services';

  public static createService = async (name: string, access: ACCESS[]) =>
    DB.getInstance().setItemByKey<Service>(
      ServicesDB.TABLE_NAME,
      {
        id: crypto.createHash('sha1').update(name).digest('hex'),
        name,
        access,
        accessKeyId: crypto.randomBytes(20).toString('hex'),
        accessSecretKey: crypto.randomBytes(40).toString('hex'),
      },
      {
        deniedOverride: true,
        primaryKey: 'name',
      }
    );

  public static findServiceByKeyAndSecret = async (accessKey: string, accessSecret: string): Promise<Service> => {
    const response = await DB.getInstance().query<Service>(this.TABLE_NAME, 'findServiceByAccessAndSecret', [
      { alias: ':k', expression: 'accessKeyId', value: accessKey },
      { alias: ':s', expression: 'accessSecretKey', value: accessSecret },
    ]);

    if (!response.Items?.length) {
      throw ErrorResponse.SignatureDoesNotMatch();
    }

    return response.Items[0] as Service;
  };

  public static updateService = async (id: string, service: Partial<Service>) => {
    await DB.getInstance().update<Service>(this.TABLE_NAME, 'id', id, service, ['accessKeyId', 'accessSecretKey', 'id']);
  };
}
