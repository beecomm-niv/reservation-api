import { Order } from './order.model';
import { ISync, PatronStatus } from './sync.model';

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
  openFromPos: boolean;
  clientName: string;
  clientPhone: string;
  patronStatus: PatronStatus;
}
