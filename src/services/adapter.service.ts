import axios, { AxiosInstance } from 'axios';
import { ReservationDto } from '../models/reservation';
import { ErrorResponse } from '../models/error-response.model';
import { OrderDto } from '../models/order.model';
import { Sync } from '../models/sync.model';

interface SendReservationBody {
  branchId: string;
  reservation: ReservationDto;
}

interface Response<T> {
  result?: boolean;
  error?: boolean;
  message?: string;
  data: T;
}

export class AdapterService {
  private static instance: AdapterService;

  public client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: 'https://ordercenter.web.delivery',
      validateStatus: () => true,
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

  public sendReservation = async (branchId: string, sync: Sync) => {
    if (!sync.reservation?.table.length) {
      throw ErrorResponse.InvalidParams();
    }

    const body: SendReservationBody = {
      branchId,
      reservation: {
        clientName: sync.reservation?.patron?.name || '',
        clientPhone: sync.reservation?.patron?.phone || '',
        comment: sync.reservation.patron?.name || '',
        dinnersCount: sync.reservation.size || 1,
        patronStatus: sync.reservation.patron?.status || 'visitor',
        syncId: sync.syncId,
        tableNum: +sync.reservation.table[0],
        duration: sync.reservation.duration || 0,
      },
    };

    const { data } = await this.client.post<Response<OrderDto>>('/mobile/sync', body);

    if (data.error || (data.result !== undefined && !data.result)) {
      throw ErrorResponse.FaildToHandleNewSync(data.message || 'internal error');
    }

    return data.data;
  };
}
