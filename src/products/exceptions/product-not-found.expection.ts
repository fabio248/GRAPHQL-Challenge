import { NotFoundException } from '@nestjs/common';

export default class ProductNotFound extends NotFoundException {
  constructor() {
    super('product not found');
  }
}
