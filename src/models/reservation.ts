import { Order } from './order.model';
import { ISync } from './sync.model';

export interface Reservation extends ISync<Order> {
  branchId: string;
  clientPhone: string;
  ts: number;
}

export interface ReservationDto {
  syncId: string;

  tableNum: number;
  dinnersCount: number;
  comment: string;
  isRandom: boolean;
}
