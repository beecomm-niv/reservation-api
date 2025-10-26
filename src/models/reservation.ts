import { Order } from './order.model';
import { Booking, PatronStatus } from './sync.model';

export interface Reservation {
  branchId: string;
  syncId: string;
  syncAt: string;
  order: Order | null;
  reservation: Booking;
  clientName: string;
  clientPhone: string;
  totalOrder: number;
  dinners: number;
  ts: number;
}

export interface ReservationDto {
  syncId: string;
  duration: number;
  tableNum: number;
  dinnersCount: number;
  comment: string;
  clientName: string;
  clientPhone: string;
  patronStatus: PatronStatus;
  status: string;
  stage: string;
  expectedDate: string;
}
