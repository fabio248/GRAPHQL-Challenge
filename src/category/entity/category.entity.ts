import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Exclude, Expose } from 'class-transformer';

@ObjectType()
export default class CategoryEntity {
  @Field(() => Int)
  @Expose()
  id: number;

  @Field(() => String)
  @Expose()
  name: string;

  @Field(() => String)
  @Expose()
  description: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
