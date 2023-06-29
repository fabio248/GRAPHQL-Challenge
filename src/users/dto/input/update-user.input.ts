import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly password?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  readonly username?: string;

  readonly recoveryToken?: string | null;
}
