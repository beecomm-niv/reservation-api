import axios, { AxiosInstance } from 'axios';
import { Reservation, ReservationDto } from '../models/reservation';
import { ErrorResponse } from '../models/error-response.model';

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

  public sendReservation = ({ branchId, reservation, order, syncId }: Reservation) => {
    if (!reservation?.table.length) {
      throw ErrorResponse.InvalidParams();
    }

    const body: SendReservationBody = {
      branchId,
      reservation: {
        clientName: reservation?.patron?.name || '',
        clientPhone: reservation?.patron?.phone || '',
        comment: reservation.patron?.name || '',
        dinnersCount: reservation.size || 1,
        openFromPos: order?.orderInfo.openFromPos || false,
        patronStatus: reservation.patron?.status || 'member',
        syncId,
        tableNum: +reservation.table[0],
      },
    };

    this.client.post('/mobile/sync', body);
  };
}
