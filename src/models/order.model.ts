import { ReservationStage } from './sync.model';

export interface OrderDto extends OrderInfo {
  id: string;
  syncId: string;
  tables: string[];
  dinnersCount: number;
  duration: number;
  expected: string;

  isNew: boolean;
  stage: ReservationStage;

  dishes?: Dish[];
}

export interface OrderInfo {
  orderId: number;
  waitress: string;
  comment: string;
  fromDate: string;
  toDate: string;
  discount: number;
  service: number;
  orderStatus: OrderStatus;
  totalOrder: number;
  openFromPos: boolean;
}

export interface Dish {
  name: string;
  dishId: number;
  netId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  cancel: boolean;

  toppings: Dish[];
}

export enum OrderStatus {
  OPEN,
  CANCEL,
  CLOSED,
  BILL = 4,
}
