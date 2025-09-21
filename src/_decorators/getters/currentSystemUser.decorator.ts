/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import type {
  IAuthenticatedRequest,
  ICurrentSystemUser,
} from 'src/_validators/auth/auth.model';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentSystemUser = createParamDecorator<
  keyof ICurrentSystemUser,
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
