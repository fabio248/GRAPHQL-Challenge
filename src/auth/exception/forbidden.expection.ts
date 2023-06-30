import { ForbiddenException } from '@nestjs/common';

export class AuthForbiddenException extends ForbiddenException {
  constructor(message?: string) {
    super(message || 'Forbidden: User without permits needed');
  }
}
