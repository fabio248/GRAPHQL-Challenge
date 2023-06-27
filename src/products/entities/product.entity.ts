import { Exclude, Expose, Type } from 'class-transformer';
import { Category, Image } from '@prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import CategoryEntity from '../../category/entity/category.entity';
import ImageProductResponse from '../dto/response/image-product-response.dto';

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
  readonly category: Category;
}
