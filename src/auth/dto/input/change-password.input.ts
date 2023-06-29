import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  recoveryToken: string;
}
