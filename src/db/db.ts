import { DynamoDB } from 'aws-sdk';
import { ErrorResponse } from '../models/error-response.model';

interface UpdateExpression {
  expression: string;
  alias: string;
  value?: any;
}

interface InsertOptions {
  primaryKey: string;
  deniedOverride: boolean;
}

export class DB {
  protected static instance: DB;

  public client: DynamoDB.DocumentClient;

  constructor() {
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

  public update = async (tableName: string, key: DynamoDB.DocumentClient.Key, expressions: UpdateExpression[]) => {
    const values = expressions.filter((v) => !!v.value);

    if (!values.length) {
      throw ErrorResponse.InvalidUpdateExpression();
    }

    const setExpression = values.map((v) => `#${v.expression} = ${v.alias}`).join(', ');
    const namesExpression = Object.assign({}, ...values.map((v) => ({ [`#${v.expression}`]: v.expression })));
    const valuesExpression = Object.assign({}, ...values.map((v) => ({ [v.alias]: v.value })));

    await this.client
      .update({
        Key: key,
        TableName: tableName,
        UpdateExpression: `set ${setExpression}`,
        ExpressionAttributeNames: namesExpression,
        ExpressionAttributeValues: valuesExpression,
      })
      .promise();
  };
}
