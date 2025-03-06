import { Sync } from './sync.model';

export interface OrderSummery {
  branchName: string;
  clientName: string;

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
  ts: number;

  orderSummery?: OrderSummery;
  sync: Sync;
}
