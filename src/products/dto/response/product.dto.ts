import { Exclude, Expose } from 'class-transformer';
import { Product } from '@prisma/client';

export class ProductResponse implements Product {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  stock: number;

  @Expose()
  price: number;

  @Expose()
  categoryId: number;

  @Exclude()
  isEnable: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<ProductResponse>) {
    Object.assign(this, partial);
  }
}
