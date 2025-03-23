import { Order, OrderDto } from '../models/order.model';

export class OrderService {
  public static dtoToOrder = (orderDto: OrderDto | null): Order | null => {
    if (!orderDto) return null;

    return {
      orderInfo: {
        comment: orderDto.comment,
        discount: orderDto.discount,
        fromDate: orderDto.fromDate,
        orderId: orderDto.orderId,
        orderStatus: orderDto.orderStatus,
        service: orderDto.service,
        toDate: orderDto.toDate,
        totalOrder: orderDto.totalOrder,
        waitress: orderDto.waitress,
        openFromPos: orderDto.openFromPos,
      },

      dishes: orderDto.dishes,
    };
  };
}
