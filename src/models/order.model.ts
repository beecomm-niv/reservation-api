export interface OrderDto extends OrderInfo {
  id: string;
  syncId: string;
  tables: string[];
  dinnersCount: number;
  duration: number;
  expected: string;

  dishes?: Dish[];
}

export interface Order {
  orderInfo: OrderInfo;
  dishes?: Dish[];
}

interface OrderInfo {
  orderId: number;
  waitress: string;
  comment: string;
  fromDate: string;
  toDate: string;
  discount: number;
  service: number;
  orderStatus: OrderStatus;
  totalOrder: number;
  isRandom: boolean;
}

interface Dish {
  name: string;
  dishId: number;
  netId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  cancel: boolean;

  toppings: Dish[];
}

enum OrderStatus {
  OPEN,
  CANCEL,
  CLOSED,
  BILL = 4,
}
