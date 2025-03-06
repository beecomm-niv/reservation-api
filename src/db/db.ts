import { config, DynamoDB } from 'aws-sdk';
import { ErrorResponse } from '../models/error-response.model';

interface InsertOptions {
  primaryKey: string;
  deniedOverride: boolean;
}

export class DB {
  protected static instance: DynamoDB.DocumentClient;

  protected db: DynamoDB.DocumentClient;
  protected tableName: string;

  constructor(tableName: string) {
    this.db = DB.getInstance();
    this.tableName = tableName;
  }

  private static getInstance = () => {
    if (!this.instance) {
      config.update({
        region: 'il-central-1',
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      this.instance = new DynamoDB.DocumentClient();
    }

    return this.instance;
  };

  public setItemByKey = async <T>(item: T, options?: InsertOptions) => {
    const deniedOverride = options?.deniedOverride && options.primaryKey;

    const condition = deniedOverride ? `attribute_not_exists(#${options.primaryKey})` : undefined;
    const alias = deniedOverride ? { [`#${options.primaryKey}`]: options?.primaryKey } : undefined;

    await this.db
      .put({
        TableName: this.tableName,
        Item: item as any,
        ExpressionAttributeNames: alias,
        ConditionExpression: condition,
      })
      .promise();
  };

  public findItemByKey = async <T>(key: DynamoDB.DocumentClient.Key): Promise<T> => {
    const response = await this.db
      .get({
        TableName: this.tableName,
        Key: key,
      })
      .promise();

    if (!response.Item) {
      throw ErrorResponse.ItemNotFound();
    }

    return response.Item as T;
  };
}
