import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsPositive } from 'class-validator';
import { mimeType } from '../enum/mimetype.enum';

@InputType()
export class CreateSignedUrlInput {
  @Field(() => mimeType)
  @IsNotEmpty()
  @IsEnum(mimeType)
  mimetype: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsPositive()
  nameFile: string;
}
