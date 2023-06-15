import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
