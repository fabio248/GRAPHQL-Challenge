import { NotFoundException } from '@nestjs/common';

export default class UserNotFoundException extends NotFoundException {
  constructor() {
    super(`user not found`);
  }
}
