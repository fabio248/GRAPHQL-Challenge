import { BadRequestException } from '@nestjs/common';

export default class NoEnoughStockException extends BadRequestException {
  constructor() {
    super('no enough stock for this product');
  }
}
