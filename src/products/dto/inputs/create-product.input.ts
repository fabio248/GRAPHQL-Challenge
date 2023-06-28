import { mimeType } from './../../../image/dto/enum/mimetype.enum';
import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsDecimal()
  price: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isEnable?: boolean;
}
