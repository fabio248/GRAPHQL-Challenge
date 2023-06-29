import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RecoveryPasswordResponse {
  @Field(() => String)
  readonly message: string;

  constructor(email: string) {
    this.message = `Mail with token sent to ${email}`;
  }
}
