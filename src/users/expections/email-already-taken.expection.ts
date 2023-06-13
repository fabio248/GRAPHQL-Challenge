import { HttpException } from '@nestjs/common';

export default class EmailAlreadyTakenException extends HttpException {
  constructor() {
    super('Email is already taken', 422);
  }
}
