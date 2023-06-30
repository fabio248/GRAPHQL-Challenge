import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class SendRecoveryEmailInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
