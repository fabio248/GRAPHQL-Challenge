import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserLikeProductEntity {
  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  type: string;
}
