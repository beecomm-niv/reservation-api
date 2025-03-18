import axios, { AxiosInstance } from 'axios';
import { Reservation, ReservationDto } from '../models/reservation';

interface AdapterResponse<T> {
  error: boolean;
  message: string;
  code: number;
  data: T;
}

interface SendReservationBody {
  branchId: string;
  reservation: ReservationDto;
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

  public sendReservation = async (reservation: Reservation) => {
    const body: SendReservationBody = {
      branchId: reservation.branchId,
      reservation: {
        clientName: reservation.clientName,
        clientPhone: reservation.clientPhone,
        dinners: reservation.sync.params.reservation?.size || 1,
        syncId: reservation.syncId,
        tableNum: +(reservation.sync.params.reservation?.table[0] || 0),
        duration: reservation.sync.params.reservation?.duration || 0,
        clientStatus: reservation.sync.params.reservation?.patron?.status || 'member',
      },
    };

    await this.client.post<AdapterResponse<boolean>>('/mobile/sync', body);
  };
}
