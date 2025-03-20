import { Order } from './order.model';
import { ISync } from './sync.model';

export interface Reservation extends ISync<Order> {
  branchId: string;
  clientPhone: string;
  ts: number;
}
