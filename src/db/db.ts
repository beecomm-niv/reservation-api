import { config, DynamoDB } from 'aws-sdk';
import { ErrorResponse } from '../models/error-response.model';

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

  public setItemByKey = async (item: any) =>
    await this.db
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();

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
