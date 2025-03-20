import axios, { AxiosInstance } from 'axios';
import { OrderDto } from '../models/order.model';
import { Sync } from '../models/sync.model';
import { SyncService } from './sync.service';
import { Reservation } from '../models/reservation';

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

  public setOrders = async (branchId: string, reservations: Reservation[], orders: OrderDto[]) => {
    const activeOrders = orders.filter((o) => !o.isRandom);
    const newOrders = orders.filter((o) => o.isRandom);

    const syncs = await SyncService.getSyncFromOrdersAndReservations(reservations, activeOrders, newOrders);

    syncs.forEach((s) => this.sendSync(branchId, s));
  };
}
