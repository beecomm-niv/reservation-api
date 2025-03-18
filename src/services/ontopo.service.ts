import axios, { AxiosInstance } from 'axios';
import { SyncDto, Sync } from '../models/sync.model';

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

  public setReservation = (sync: Sync, branchId: string) => {
    const dto: Sync = {
      syncAt: sync.syncAt,
      syncId: sync.syncId,
      order: sync.order,
      reservation: sync.reservation,
    };

    this.api.post('/pos/setReservation', dto, {
      timeout: 10_000,
      headers: {
        'x-api-key': branchId,
      },
    });
  };
}
