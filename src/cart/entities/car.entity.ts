import { User } from '@prisma/client';
import { ProductInCarEntity } from './';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserEntiy } from '../../users/entities/user.entity';

@ObjectType()
export class CartEntity {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  total: number;

  @Field(() => UserEntiy)
  user: User;

  @Field(() => [ProductInCarEntity], { nullable: true })
  products: ProductInCarEntity[];
}
