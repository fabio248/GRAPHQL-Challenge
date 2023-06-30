import { OrderDetail } from '@prisma/client';
import { OrderDetailsEntity } from './order-details-response.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderEntity {
  @Field(() => Int)
  readonly id: number;

  @Field(() => Int)
  readonly userId: number;

  @Field(() => String)
  readonly total: number;

  @Field(() => [OrderDetailsEntity])
  readonly orderDetails: OrderDetail[];
}
