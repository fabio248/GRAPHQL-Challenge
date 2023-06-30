import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserEntiy {
  @Field(() => Int, { description: "user's id" })
  id: number;

  @Field(() => String, { description: "user's email" })
  email: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  role: string;
}
