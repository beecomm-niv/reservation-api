import { ErrorResponse } from '../models/error-response.model';
import { Service } from '../models/service.model';
import { DB } from './db';
import crypto from 'crypto';

export class ServicesDB extends DB {
  constructor() {
    super('services');
  }

  public createService = async (name: string, access: string[]) =>
    this.setItemByKey<Service>(
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

  public findServiceByKeyAndSecret = async (accessKey: string, accessSecret: string): Promise<Service> => {
    const response = await this.db
      .query({
        TableName: this.tableName,
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
