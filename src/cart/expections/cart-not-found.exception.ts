import { NotFoundException } from '@nestjs/common';

export default class CartNotFoundException extends NotFoundException {
  constructor() {
    super('cart not found');
  }
}
