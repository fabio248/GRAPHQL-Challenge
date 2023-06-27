import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCartInput {
  @Field(() => Int, { nullable: true })
  @IsNotEmpty()
  total?: number;
}
