import { BadRequestException } from '@nestjs/common';

export class NoProductsInCarException extends BadRequestException {
  constructor() {
    super('No products in cart');
  }
}
