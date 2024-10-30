/* eslint-disable @typescript-eslint/naming-convention */
import {
  IAuthenticatedRequestWithRt,
  ICurrentSystemUserIdWithRt,
} from '@/_validators/auth/auth.model';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentSystemUserFromRt = createParamDecorator<
  keyof ICurrentSystemUserIdWithRt,
  ExecutionContext,
  number | string | IAuthenticatedRequestWithRt['user']
>(
  (
    data: keyof ICurrentSystemUserIdWithRt,
    context: ExecutionContext,
  ): IAuthenticatedRequestWithRt['user'] | string | number => {
    const request = context
      .switchToHttp()
      .getRequest<IAuthenticatedRequestWithRt>();

    const user = request.user;

    const property = user?.[data];

    return data ? property : user;
  },
);
