import { Category, Image } from '@prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import CategoryEntity from '../../category/entity/category.entity';
import ImageEntity from '../../image/entities/image.entity';

@ObjectType()
export class ProductEntity {
  @Field(() => Int)
  readonly id: number;

  @Field(() => String)
  readonly name: string;

  @Field(() => String)
  readonly description: string;

  @Field(() => Int)
  readonly stock: number;

  @Field(() => String)
  readonly price: number;

  @Field(() => Boolean)
  readonly isEnable: boolean;

  @Field(() => CategoryEntity)
  readonly category: Category;

  @Field(() => [ImageEntity])
  readonly images: Image[];
}
