import { Cart, ProductInCar } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import ProductInCarResponse from './products-in-car.dto';

export default class CartResponse implements Cart {
  @Expose()
  id: number;

  @Expose()
  @Transform(({ value }) => Number(value.toFixed(2)))
  total: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  userId: number;

  @Expose()
  @Type(() => ProductInCarResponse)
  products: ProductInCar[];
}
