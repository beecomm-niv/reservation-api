export interface Order {
  id?: string;
  syncId: string;
  orderId: number;
  tableNum: number;
  discount: number;
  service: number;
  date: string;
  orderStatus: number;
  dinners: number;
  waitress: string;

  dishes: Dish[];
}

interface Dish {
  name: string;
  dishId: number;
  netId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  isCancel: boolean;

  toppings: Dish[];
}
