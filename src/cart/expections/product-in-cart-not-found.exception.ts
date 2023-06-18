import { NotFoundException } from '@nestjs/common';

export default class ProductInCarNotFoundException extends NotFoundException {
  constructor() {
    super('product in car not found');
  }
}
