import axios, { AxiosInstance } from 'axios';
import { Sync } from '../models/sync.model';
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

  public setReservation = (branchId: string, reservation: Reservation) => {
    const body: Sync = {
      syncAt: reservation.syncAt,
      syncId: reservation.syncId,
      order: reservation.order,
      reservation: reservation.reservation,
    };
    this.api.post('/pos/setReservation', body, {
      timeout: 10_000,
      headers: {
        'x-api-key': branchId,
      },
    });
  };
}
