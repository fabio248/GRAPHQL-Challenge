import { BadRequestException } from '@nestjs/common';

export default class NoEnoughStockException extends BadRequestException {
  constructor(id: number) {
    super(`no enough stock for product with id ${id}`);
  }
}
