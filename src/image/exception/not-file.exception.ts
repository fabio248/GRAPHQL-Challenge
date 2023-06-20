import { BadRequestException } from '@nestjs/common';

export default class NoFileException extends BadRequestException {
  constructor() {
    super('file is required!');
  }
}
