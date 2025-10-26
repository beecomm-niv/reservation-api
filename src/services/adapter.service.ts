import axios, { AxiosInstance } from 'axios';

interface Response<T> {
  result?: boolean;
  error?: boolean;
  message?: string;
  data: T;
}

export class AdapterService {
  private static instance: AdapterService;

  public client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: 'https://ordercenter.web.delivery',
      validateStatus: () => true,
      headers: {
        Authorization: 'aeaaf825-0252-4088-8c4d-cab0d8470b47',
      },
    });
  }

  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new AdapterService();
    }

    return this.instance;
  };
}
