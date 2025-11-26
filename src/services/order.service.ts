import { Order } from '../models/order.model';

export class OrderService {
  public static getOrderTotalFromDishes = (order: Order | null): number => order?.items.reduce((prev, item) => prev + item.price, 0) || 0;
}
