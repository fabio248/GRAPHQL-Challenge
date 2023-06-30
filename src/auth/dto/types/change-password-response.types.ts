import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChangedPaswordResponse {
  @Field(() => String)
  readonly message: string;

  constructor(email: string) {
    this.message = `Password changed successfully, confimartion mail sent to ${email}`;
  }
}
