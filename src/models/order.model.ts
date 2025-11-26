import { ReservationStage, ReservationStatus } from './sync.model';

export interface Order {
  syncId: string;
  posOrderId: string;
  orderNumber: number;
  openedAt: string;
  netTotal: number;
  items: Item[];
  discountAmount: number;
  dinnersCount: number;
  currentCourse: number;
  serviceAmount: number;
  payments: any[];
  comment: string;
  reservationId: string;
  tables: string[];
  isVisitor: boolean;
  isStaffTable: boolean;

  orderStatus: number;
  duration: number;
  stage: ReservationStage;
  status: ReservationStatus;
}

export interface Item {
  itemId: string;
  itemName: string;
  quantity: number;
  status: number;
  discount: number;
  price: number;
}
