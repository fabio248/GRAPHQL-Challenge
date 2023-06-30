import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class RemoveProductInCartInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
