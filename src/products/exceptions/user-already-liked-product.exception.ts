import { BadRequestException } from '@nestjs/common';

export default class UserAlreadyLikeProductException extends BadRequestException {
  constructor() {
    super('user already liked product');
  }
}
