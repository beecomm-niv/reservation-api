import axios, { AxiosInstance } from 'axios';
import { ReservationDto } from '../models/reservation';
import { Sync } from '../models/sync.model';

interface AdapterResponse<T> {
  error: boolean;
  message: string;
  code: number;
  data: T;
}

export class AdapterService {
  private static instance: AdapterService;

  public client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: 'https://ordercenter.web.delivery',
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

  public sendReservation = async (sync: Sync) => {
    const body: ReservationDto = {
      branchId: sync.branchId,
      reservation: {
        clientName: sync.params.reservation.patron.name,
        clientPhone: sync.params.reservation.patron.phone,
        dinners: sync.params.reservation.size,
        syncId: sync.params.syncId,
        tableNum: +sync.params.reservation.table[0],
      },
    };
    const response = await this.client.post<AdapterResponse<boolean>>('/mobile/sync', body);

    console.log(response.data);
  };
}
