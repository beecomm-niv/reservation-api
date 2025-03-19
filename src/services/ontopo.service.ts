import axios, { AxiosInstance } from 'axios';
import { Sync } from '../models/sync.model';
import { Reservation } from '../models/reservation';
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

  private sendSync = (branchId: string, sync: Sync) => {
    this.api.post('/pos/setReservation', sync, {
      timeout: 10_000,
      headers: {
        'x-api-key': branchId,
      },
    });
  };

  public setRandomOrder = (branchId: string, order: Order) => {
    this.sendSync(branchId, {
      order,
      reservation: null,
      syncAt: '',
      syncId: order.syncId,
    });
  };

  public setReservation = (branchId: string, reservation: Reservation) => {
    this.sendSync(branchId, {
      order: reservation.order,
      reservation: reservation.reservation,
      syncAt: reservation.syncAt,
      syncId: reservation.syncId,
    });
  };
}
