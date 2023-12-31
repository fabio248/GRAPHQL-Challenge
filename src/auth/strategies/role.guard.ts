import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';
import { PayloadJwt } from '../../types/generic';

const RoleGuard = (...roles: string[]): Type<CanActivate> => {
  class RoleGuardMinxin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const req = context.switchToHttp().getRequest<Request>();
      const user = req.user as PayloadJwt;

      return roles.includes(user.role);
    }
  }

  return mixin(RoleGuardMinxin);
};

export default RoleGuard;
