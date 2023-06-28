import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateProductInCarInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
