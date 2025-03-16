import { DynamoDB } from 'aws-sdk';
import { ErrorResponse } from '../models/error-response.model';

interface Expressions<T> {
  expression: keyof T;
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

  private getNameAndValuesExpressions = <T>(expressions: Expressions<T>[], join: string) => {
    const validExpressions = expressions.filter((v) => !!v.value);

    if (!validExpressions) {
      throw ErrorResponse.InvalidExpression();
    }

    return {
      expressionString: validExpressions.map((v) => `#${v.expression.toString()} = ${v.alias}`).join(join),
      names: Object.assign({}, ...validExpressions.map((v) => ({ [`#${v.expression.toString()}`]: v.expression }))),
      values: Object.assign({}, ...validExpressions.map((v) => ({ [v.alias]: v.value }))),
    };
  };

  public update = async <T>(tableName: string, primaryKey: keyof T, primaryKeyValue: string, expressions: Expressions<T>[]) => {
    const { names, values, expressionString } = this.getNameAndValuesExpressions(expressions, ', ');

    await this.client
      .update({
        Key: { [primaryKey]: primaryKeyValue },
        TableName: tableName,
        UpdateExpression: `set ${expressionString}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: `attribute_exists(${primaryKey.toString()})`,
      })
      .promise();
  };

  public query = async <T>(tableName: string, indexName: string, expressions: Expressions<T>[]) => {
    const { names, expressionString, values } = this.getNameAndValuesExpressions(expressions, ' AND ');

    return await this.client
      .query({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: expressionString,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
      .promise();
  };
}
