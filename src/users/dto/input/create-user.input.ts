import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @IsEmail()
  @IsOptional()
  email: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  password: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  username: string;
}
