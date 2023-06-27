import { ForbiddenException } from '@nestjs/common';

export default class AuthForbiddenException extends ForbiddenException {
  constructor(message?: string) {
    super(message || 'Forbidden: User without permits needed');
  }
}
