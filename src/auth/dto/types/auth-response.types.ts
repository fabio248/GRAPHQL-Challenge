import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field(() => String, { description: 'access token' })
  accessToken: string;

  @Field(() => User, { description: "user's information" })
  user: User;
}
