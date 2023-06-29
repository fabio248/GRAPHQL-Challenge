import { UnauthorizedException } from '@nestjs/common';
export class AuthUnauthorizedException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || 'credentials invalids');
  }
}
