import { Product, ProductInCar } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ProductEntity } from '../../../products/entities';

export default class ProductInCarResponse implements ProductInCar {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  subtotal: number;

  @Expose()
  @Type(() => ProductEntity)
  product: Product;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  cartId: number;

  @Expose()
  productId: number;
}
