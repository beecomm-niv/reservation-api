import { config, DynamoDB } from 'aws-sdk';

export class DB {
  private static instance: DB;

  public db: DynamoDB.DocumentClient;

  private constructor() {
    config.update({
      region: 'il-central-1',
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    this.db = new DynamoDB.DocumentClient();
  }

  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new DB();
    }

    return this.instance.db;
  };
}
