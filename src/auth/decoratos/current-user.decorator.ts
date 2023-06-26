import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import AuthForbiddenException from '../exception/forbidden.exception';

export const CurrentUser = createParamDecorator(
  (roles: Role[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (!user) {
      throw new InternalServerErrorException(
        'no user inside request - make sure that we used authGuard',
      );
    }

    const isAuthorized: boolean = roles.includes(user.role);

    if (!isAuthorized) {
      throw new AuthForbiddenException();
    }

    return user;
  },
);
