import { NotFoundException } from '@nestjs/common';

export default class ProductNotFoundException extends NotFoundException {
  constructor() {
    super('product not found');
  }
}
