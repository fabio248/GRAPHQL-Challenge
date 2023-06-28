import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsPositive } from 'class-validator';
import { mimeType } from '../enum/mimetype.enum';

@InputType()
export class CreateImageInput {
  @Field(() => mimeType)
  @IsEnum(mimeType)
  @IsNotEmpty()
  mimetype: string;

  @Field(() => Int)
  @IsPositive()
  @IsNotEmpty()
  productId: number;
}
