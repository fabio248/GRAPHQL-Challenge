import { BadRequestException } from '@nestjs/common';

export default class UserAlreadyHaveCartException extends BadRequestException {
  constructor() {
    super('user already have car');
  }
}
