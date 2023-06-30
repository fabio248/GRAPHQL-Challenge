import { Product } from '@prisma/client';
import { ProductEntity } from '../../products/entities';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductInCarEntity {
  @Field(() => String)
  quantity: number;

  @Field(() => String)
  subtotal: number;

  @Field(() => ProductEntity)
  product: Product;

  @Field(() => Int)
  cartId: number;

  @Field(() => Int)
  productId: number;
}
