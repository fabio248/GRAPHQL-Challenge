import { Product, ProductInCar } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ProductResponse } from '../../../products/dto/response/product.dto';

export default class ProductInCarResponse implements ProductInCar {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  subtotal: number;

  @Expose()
  @Type(() => ProductResponse)
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
