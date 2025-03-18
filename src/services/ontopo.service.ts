import axios, { AxiosInstance } from 'axios';
import { SyncDto, Sync, HostReservation } from '../models/sync.model';
import { Order } from '../models/order.model';

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

  public setReservation = (branchId: string, syncId: string, syncAt: string, order: Order | undefined, reservation: HostReservation | undefined) => {
    const dto: Sync = {
      syncAt: syncAt,
      syncId: syncId,
      order: order,
      reservation: reservation,
    };

    this.api.post('/pos/setReservation', dto, {
      timeout: 10_000,
      headers: {
        'x-api-key': branchId,
      },
    });
  };
}
