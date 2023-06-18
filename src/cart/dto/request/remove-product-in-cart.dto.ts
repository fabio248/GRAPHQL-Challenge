import { IsNotEmpty, IsNumber } from 'class-validator';

export default class RemoveProductInCartDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
