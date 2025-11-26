import { CloudWatchLogsClient, CloudWatchLogsClientConfig, PutLogEventsCommand, PutLogEventsCommandInput } from '@aws-sdk/client-cloudwatch-logs';
import dayjs from 'dayjs';

export class LogService {
  private static instance: LogService;

  private logs: CloudWatchLogsClient;

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  private constructor() {
    this.logs = new CloudWatchLogsClient(this.logsConfigFactory());
  }

  private logsConfigFactory(): CloudWatchLogsClientConfig {
    const config: CloudWatchLogsClientConfig = {
      region: process.env.AWS_REGION || 'il-central-1',
    };

    if (process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_ACCESS_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }

    return config;
  }

  public saveLog = (message: string) => {
    const params: PutLogEventsCommandInput = {
      logGroupName: 'reservation-api-logs',
      logStreamName: 'reservation-api-stream',
      logEvents: [
        {
          message,
          timestamp: dayjs().valueOf(),
        },
      ],
    };

    this.logs.send(new PutLogEventsCommand(params)).catch(() => {});
  };
}
