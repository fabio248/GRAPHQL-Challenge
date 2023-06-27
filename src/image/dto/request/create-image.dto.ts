import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
@InputType()
export class CreateImageInput {
  @IsNotEmpty()
  @IsString()
  name: string;
}
