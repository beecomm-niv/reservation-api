import axios, { AxiosInstance } from 'axios';
import { OrderDto } from '../models/order.model';
import { Sync } from '../models/sync.model';
import dayjs from 'dayjs';

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

  private sendSync = (branchId: string, sync: Sync) => {
    this.api.post('/pos/setReservation', sync, {
      timeout: 10_000,
      headers: {
        'x-api-key': branchId,
      },
    });
  };

  public setOrders = async (branchId: string, syncs: Sync[], newOrders: OrderDto[]) => {
    const newSyncs = newOrders.map<Sync>((o) => ({
      syncId: o.syncId,
      reservation: null,
      order: o,
      syncAt: dayjs().utc().format(),
    }));

    syncs.concat(newSyncs).forEach((s) => this.sendSync(branchId, s));
  };
}
