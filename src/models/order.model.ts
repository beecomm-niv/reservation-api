export interface Order {
  tableInfo: OrderInfo;
  dishes: Dish[];
  payments: Payment[];
  cancelDishes: Dish[];
}

export interface OrderInfo {
  orderId: number;
  tableNum: number;
  discount: number;
  service: number;
  date: string;
  orderStatus: number;
  paymentSum: number;
  dishesSum: number;
  dinners: number;
  waitress: string;
}

export interface Dish {
  name: string;
  indexDishInOrder: number;
  quantity: number;
  totalPrice: number;
  toppings: Dish[];
  cancelToppings?: Dish[];
  billRemark?: string;
}

export interface Payment {
  paymentTypeName: string;
  sum: number;
  paymentType: string;
}
