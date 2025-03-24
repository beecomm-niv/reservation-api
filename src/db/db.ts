import { BatchGetCommand, BatchWriteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ErrorResponse } from '../models/error-response.model';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

interface Config {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

interface Expressions<T> {
  expression: keyof T;
  alias: string;
  value?: any;
}

interface InsertOptions<T> {
  primaryKey: keyof T;
  deniedOverride: boolean;
}

export class DB {
  protected static instance: DB;

  public client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(DB.dbConfigFactory()), {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  private static dbConfigFactory = (): Config => {
    const accessKeyId = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    const config: Config = {
      region: 'il-central-1',
    };

    if (accessKeyId && secretAccessKey) {
      config.credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    return config;
  };

  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new DB();
    }

    return this.instance;
  };

  public setItemByKey = async <T>(tableName: string, item: T, options?: InsertOptions<T>) => {
    const deniedOverride = options?.deniedOverride && options.primaryKey;

    const condition = deniedOverride ? `attribute_not_exists(#${options.primaryKey.toString()})` : undefined;
    const alias = deniedOverride ? { [`#${options.primaryKey.toString()}`]: options?.primaryKey.toString() } : undefined;

    await this.client.send(
      new PutCommand({
        TableName: tableName,
        Item: item as any,
        ExpressionAttributeNames: alias,
        ConditionExpression: condition,
      })
    );
  };

  public findItemByKey = async <T>(tableName: string, key: Record<string, any>): Promise<T> => {
    const response = await this.client.send(
      new GetCommand({
        TableName: tableName,
        Key: key,
      })
    );

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

    await this.client.send(
      new UpdateCommand({
        Key: { [primaryKey]: primaryKeyValue },
        TableName: tableName,
        UpdateExpression: `set ${expressionString}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: `attribute_exists(${primaryKey.toString()})`,
      })
    );
  };

  public query = async <T>(tableName: string, indexName: string, expressions: Expressions<T>[]) => {
    const { names, expressionString, values } = this.getNameAndValuesExpressions(expressions, ' AND ');

    return await this.client.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: expressionString,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );
  };

  public multiWrite = async <T>(tableName: string, items: T[]) => {
    if (!items.length) return;

    await this.client.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: items.map((i) => ({
            PutRequest: {
              Item: i as any,
            },
          })),
        },
      })
    );
  };

  public multiGet = async <T>(tableName: string, keys: Record<string, any>[]) => {
    const response = await this.client.send(
      new BatchGetCommand({
        RequestItems: {
          [tableName]: {
            Keys: keys,
          },
        },
      })
    );

    return (response.Responses?.[tableName] || []) as T[];
  };
}
