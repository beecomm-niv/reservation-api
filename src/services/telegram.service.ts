import axios, { AxiosInstance } from 'axios';

export class TelegramService {
  private static instance: TelegramService;

  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      timeout: 5000,
    });
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }

    return TelegramService.instance;
  }

  public sendTelegramMessage = async (message: string, chatId: string, isHTML: boolean) => {
    await this.api.post('', {
      chat_id: chatId,
      text: message,
      parse_mode: isHTML ? 'HTML' : undefined,
    });
  };
}
