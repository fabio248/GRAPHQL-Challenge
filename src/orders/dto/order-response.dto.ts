import { Order, OrderDetail } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import OrderDetailsReponse from './order-details-response.dto';

export default class OrderResponse implements Order {
  @Expose()
  id: number;

  userId: number;
  @Expose()
  total: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderDetailsReponse)
  orderDetails: OrderDetail;
}
