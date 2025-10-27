import { Order } from '../models/order.model';

export class OrderService {
  public static getOrderTotalFromDishes = (order: Order | null) => {
    let total = 0;

    if (order?.dishes.length) {
      order.dishes.forEach((d) => {
        total += d.totalPrice;

        d.toppings.forEach((t) => (total += t.totalPrice));
      });
    }

    return total;
  };
}
