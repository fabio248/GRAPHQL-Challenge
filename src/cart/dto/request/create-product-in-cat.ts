import { IsNotEmpty, IsNumber } from 'class-validator';

export default class CreateProductInCarDto {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
