import { Dish, OrderInfo } from './order.model';
import { ISync, PatronStatus } from './sync.model';

export type Reservation = ISync & {
  branchId: string;
  clientPhone: string;
  ts: number;

  orderInfo: OrderInfo | null;
  dishes: Dish[] | null;
};

export interface ReservationDto {
  syncId: string;

  duration: number;
  tableNum: number;
  dinnersCount: number;
  comment: string;
  clientName: string;
  clientPhone: string;
  patronStatus: PatronStatus;
}
