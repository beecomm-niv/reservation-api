import { PatronStatus, Sync } from './sync.model';

export interface OrderSummery {
  branchName: string;

  orderId: number;
  totalOrder: number;
  discount: number;
  service: number;
}

export interface Reservation extends Sync {
  branchId: string;
  clientPhone: string;
  clientName: string;
  ts: number;

  orderSummery?: OrderSummery;
}

export interface ReservationDto {
  syncId: string;
  clientPhone?: string;
  clientName?: string;
  tableNum: number;
  dinners: number;
  duration: number;
  clientStatus: PatronStatus;

  orderId?: number;
  isNew?: boolean;
}
