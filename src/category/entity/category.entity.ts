import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class CategoryEntity {
  @Field(() => Int)
  readonly id: number;

  @Field(() => String)
  readonly name: string;

  @Field(() => String)
  readonly description: string;
}
