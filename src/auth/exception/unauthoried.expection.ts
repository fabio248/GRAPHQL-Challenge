import { UnauthorizedException } from '@nestjs/common';
export default class AuthUnauthorizedException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || 'credentials invalids');
  }
}
