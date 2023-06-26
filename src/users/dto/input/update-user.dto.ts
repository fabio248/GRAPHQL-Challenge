import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  password: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  username: string;
}
