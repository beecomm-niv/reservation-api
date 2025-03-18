import { Sync } from './sync.model';

export interface OrderSummery {
  branchName: string;

  orderId: number;
  table: number;
  dinners: number;
  totalOrder: number;
  discount: number;
  service: number;
}

export interface Reservation {
  syncId: string;
  branchId: string;
  clientPhone: string;
  clientName: string;
  ts: number;

  orderSummery?: OrderSummery;
  sync: Sync;
}

export interface ReservationDto {
  syncId: string;
  clientPhone?: string;
  clientName?: string;
  tableNum: number;
  dinners: number;
  duration: number;

  orderId?: number;
  isNew?: boolean;
}
