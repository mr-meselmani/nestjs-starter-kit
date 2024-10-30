/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  IAuthenticatedRequest,
  ICurrentSystemUser,
} from '@/_validators/auth/auth.model';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentSystemUser = createParamDecorator<
  keyof ICurrentSystemUser,
  ExecutionContext,
  ICurrentSystemUser[keyof ICurrentSystemUser] | ICurrentSystemUser
>(
  (
    data: keyof ICurrentSystemUser,
    context: ExecutionContext,
  ): ICurrentSystemUser[keyof ICurrentSystemUser] | ICurrentSystemUser => {
    const request = context.switchToHttp().getRequest<IAuthenticatedRequest>();
    const user = request.user;

    const property = user?.[data];

    return data ? property : user;
  },
);
