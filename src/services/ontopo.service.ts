import axios, { AxiosInstance } from 'axios';
import { Sync, SyncParams } from '../models/sync.model';

export class OntopoService {
  private static instance: OntopoService;

  public api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://top-openapi.staging-01.ontopo.cz',
      validateStatus: () => true,
    });
  }

  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new OntopoService();
    }

    return this.instance;
  };

  public setReservation = (sync: SyncParams, branchId: string) => {
    try {
      this.api.post('/pos/setReservation', sync, {
        timeout: 10_000,
        headers: {
          'x-api-key': branchId,
        },
      });
    } catch {}
  };
}
