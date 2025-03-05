import { config, DynamoDB } from 'aws-sdk';

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
}
