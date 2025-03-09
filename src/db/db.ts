import { config, DynamoDB } from 'aws-sdk';
import { ErrorResponse } from '../models/error-response.model';

interface InsertOptions {
  primaryKey: string;
  deniedOverride: boolean;
}

export class DB {
  protected static instance: DB;

  public client: DynamoDB.DocumentClient;

  constructor() {
    config.update({
      region: 'il-central-1',
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    this.client = new DynamoDB.DocumentClient();
  }

  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new DB();
    }

    return this.instance;
  };

  public setItemByKey = async <T>(tableName: string, item: T, options?: InsertOptions) => {
    const deniedOverride = options?.deniedOverride && options.primaryKey;

    const condition = deniedOverride ? `attribute_not_exists(#${options.primaryKey})` : undefined;
    const alias = deniedOverride ? { [`#${options.primaryKey}`]: options?.primaryKey } : undefined;

    await this.client
      .put({
        TableName: tableName,
        Item: item as any,
        ExpressionAttributeNames: alias,
        ConditionExpression: condition,
      })
      .promise();
  };

  public findItemByKey = async <T>(tableName: string, key: DynamoDB.DocumentClient.Key): Promise<T> => {
    const response = await this.client
      .get({
        TableName: tableName,
        Key: key,
      })
      .promise();

    if (!response.Item) {
      throw ErrorResponse.ItemNotFound();
    }

    return response.Item as T;
  };
}
