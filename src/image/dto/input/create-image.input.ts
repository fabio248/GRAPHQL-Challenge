import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive } from 'class-validator';

@InputType()
export class CreateImageInput {
  @Field(() => String)
  @IsNotEmpty()
  mimetype: string;

  @Field(() => Int)
  @IsPositive()
  @IsNotEmpty()
  productId: number;
}
