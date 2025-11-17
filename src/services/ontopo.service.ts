import axios, { AxiosInstance } from 'axios';
import { Sync } from '../models/sync.model';

export class OntopoService {
  private static instance: OntopoService;

  public api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://top-openapi.staging-01.ontopo.cz',
      timeout: 10_000,
      validateStatus: () => true,
    });
  }

  public static getInstance = () => {
    if (!this.instance) {
      this.instance = new OntopoService();
    }

    return this.instance;
  };

  private sendSync = async (branchId: string, sync: Sync) => {
    await this.api.post('/pos/setReservation', sync, {
      headers: {
        'x-api-key': branchId,
      },
    });
  };

  public setReservations = async (branchId: string, syncs: Sync[]) => {
    const promises: Promise<void>[] = syncs.map((s) => this.sendSync(branchId, s));

    await Promise.all(promises);
  };

  public getTodayReservations = async (branchId: string): Promise<Sync[]> => {
    const response = await this.api.post('/pos/reservationsForToday', undefined, {
      headers: {
        'x-api-key': branchId,
      },
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed with status ' + response.status);
    }

    return response.data as Sync[];
  };
}
