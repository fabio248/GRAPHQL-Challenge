import { BadRequestException } from '@nestjs/common';

export default class NoProductsInCarException extends BadRequestException {
  constructor() {
    super('No products in cart');
  }
}
