export interface Order {
  id: string;
  syncId: string;
  orderId: number;

  tables: string[];
  dinnersCount: number;
  duration: number;
  waitress: string;
  comment: string;
  fromDate: string;
  toDate: string;
  discount: number;
  service: number;
  orderStatus: number;
  totalOrder: number;
  isVisitor: boolean;

  dishes: Dish[];
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
