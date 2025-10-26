import axios, { AxiosInstance } from 'axios';
import { ReservationDto } from '../models/reservation';
import { ErrorResponse } from '../models/error-response.model';
import { Sync } from '../models/sync.model';
import { ReservationsService } from './reservations.service';

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

  private client: AxiosInstance;

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
      reservation: ReservationsService.convertSyncToReservationDto(sync),
    };

    const { data } = await this.client.post<Response<boolean>>('/mobile/sync', body);

    if (data.error || (data.result !== undefined && !data.result)) {
      throw ErrorResponse.FaildToHandleNewSync(data.message || 'internal error');
    }

    return data.data;
  };
}
