import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntiy } from '../../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field(() => String, { description: 'access token' })
  accessToken: string;

  @Field(() => UserEntiy, { description: "user's information" })
  user: UserEntiy;
}
