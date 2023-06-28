import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, Matches } from 'class-validator';

@InputType()
export class CreateSignedUrlInput {
  @Field(() => String)
  @IsNotEmpty()
  @Matches(/^image\/(jpg|jpeg|png)$/, {
    message: "should be 'image/jpg', 'image/png', 'image/jpeg'",
  })
  mimetype: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsPositive()
  nameFile: string;
}
