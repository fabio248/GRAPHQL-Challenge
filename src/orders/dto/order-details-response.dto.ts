import { OrderDetail, Product } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export default class OrderDetailsReponse implements OrderDetail {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  subtotal: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  orderId: number;

  @Exclude()
  productId: number;

  @Expose()
  product: Product;
}
