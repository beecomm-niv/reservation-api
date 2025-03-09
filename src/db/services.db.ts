import { ErrorResponse } from '../models/error-response.model';
import { ACCESS } from '../models/jwt-payload.model';
import { Service } from '../models/service.model';
import { DB } from './db';
import crypto from 'crypto';

export class ServicesDB {
  private static TABLE_NAME = 'services';

  public static createService = async (name: string, access: ACCESS[]) =>
    DB.getInstance().setItemByKey<Service>(
      this.TABLE_NAME,
      {
        name,
        access,
        accessKeyId: crypto.randomBytes(20).toString('base64url'),
        accessSecretKey: crypto.randomBytes(40).toString('base64url'),
      },
      {
        deniedOverride: true,
        primaryKey: 'name',
      }
    );

  public static findServiceByKeyAndSecret = async (accessKey: string, accessSecret: string): Promise<Service> => {
    const response = await DB.getInstance()
      .client.query({
        TableName: this.TABLE_NAME,
        IndexName: 'accessKeyId-accessSecretKey-index',
        KeyConditionExpression: 'accessKeyId = :k And accessSecretKey = :s',
        ExpressionAttributeValues: {
          ':k': accessKey,
          ':s': accessSecret,
        },
      })
      .promise();

    if (!response.Items?.length) {
      throw ErrorResponse.SignatureDoesNotMatch();
    }

    return response.Items[0] as Service;
  };
}
