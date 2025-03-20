import axios, { AxiosInstance } from 'axios';
import { Reservation, ReservationDto } from '../models/reservation';

interface SendReservationBody {
  branchId: string;
  reservation: ReservationDto;
  comment: string;
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

  public sendReservation = (branchId: string, reservation: Reservation) => {
    const body: SendReservationBody = {
      branchId,
      comment: reservation.reservation?.patron?.name || '',
      reservation: {
        syncId: reservation.syncId,
        dinnersCount: reservation.reservation?.size || 1,
        tableNum: +(reservation.reservation?.table[0] || -1),
      },
    };

    this.client.post('/mobile/sync', body);
  };
}
