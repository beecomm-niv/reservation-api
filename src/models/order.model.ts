export interface Order {
  id: string;
  syncId: string;
  orderId: number;
  tables: string[];
  discount: number;
  service: number;
  startDate: string;
  finishDate: string;
  orderStatus: number;
  dinnersCount: number;
  watiress: string;
  comment: string;
  duration: number;
  expected: string;
  clientPhone: string;
  clientName: string;
  isRandom: boolean;

  dishes?: Dish[];
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
