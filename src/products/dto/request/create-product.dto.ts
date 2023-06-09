import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsDecimal()
  price: string;

  @IsNotEmpty()
  @IsNumber()
  catalogId: number;

  @IsOptional()
  @IsBoolean()
  isEnable?: boolean;
}
