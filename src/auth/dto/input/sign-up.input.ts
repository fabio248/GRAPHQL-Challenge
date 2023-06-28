import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../enum/roles.enum';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Field(() => Role, {
    description: 'user role this can be: CLIENT or MANAGER',
    nullable: true,
    defaultValue: Role.CLIENT,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
