import { Exclude, Expose, Type } from 'class-transformer';
import { Category, Image } from '@prisma/client';
import ImageProductResponse from './image-product-response.dto';
import CategoryProductResponse from './category-product-response.dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import CategoryEntity from '../../category/entity/category.entity';

@ObjectType()
export class ProductEntity {
  @Field(() => Int)
  @Expose()
  readonly id: number;

  @Field(() => String)
  @Expose()
  readonly name: string;

  @Field(() => String)
  @Expose()
  readonly description: string;

  @Field(() => Int)
  @Expose()
  readonly stock: number;

  @Field(() => String)
  @Expose()
  readonly price: number;

  @Field(() => Boolean)
  @Expose()
  readonly isEnable: boolean;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Expose()
  @Type(() => ImageProductResponse)
  readonly images: Image[];

  @Field(() => CategoryEntity)
  @Expose()
  @Type(() => CategoryProductResponse)
  readonly category: Category;
}
