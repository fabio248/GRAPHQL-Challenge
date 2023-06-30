import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class ImageEntity {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  mimetype: string;

  @Field(() => String)
  url: string;
}
