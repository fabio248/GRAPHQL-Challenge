import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '@prisma/client';
import { ProductEntity } from '../../products/entities';

@ObjectType()
export class OrderDetailsEntity {
  @Field(() => Int)
  readonly id: number;

  @Field(() => Int)
  readonly quantity: number;

  @Field(() => String)
  readonly subtotal: number;

  @Field(() => Int)
  readonly orderId: number;

  @Field(() => ProductEntity)
  readonly product: Product;
}
