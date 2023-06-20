import { Cart } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import ProductInCarResponse from './products-in-car.dto';

export default class CartResponse implements Cart {
  @Expose()
  id: number;

  @Expose()
  total: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  userId: number;

  @Expose()
  @Type(() => ProductInCarResponse)
  products: ProductInCarResponse[];
}
