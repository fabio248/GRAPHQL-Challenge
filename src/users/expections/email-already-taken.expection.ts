import { HttpException } from '@nestjs/common';

export default class EmailAlreadyTakenExtension extends HttpException {
  constructor() {
    super('Email is already taken', 422);
  }
}
