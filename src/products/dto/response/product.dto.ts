import { Exclude, Expose, Type } from 'class-transformer';
import { Category, Image, Product } from '@prisma/client';
import ImageProductResponse from './image-product-response.dto';
import CategoryProductResponse from './category-product-response.dto';

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

  @Exclude()
  categoryId: number;

  @Expose()
  isEnable: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  @Type(() => ImageProductResponse)
  images: Image[];

  @Expose()
  @Type(() => CategoryProductResponse)
  category: Category;
}
