import { NotFoundException } from '@nestjs/common';

export default class CatalogNotFoundException extends NotFoundException {
  constructor() {
    super('catalog not found');
  }
}
