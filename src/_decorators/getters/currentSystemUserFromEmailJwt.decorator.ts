/* eslint-disable @typescript-eslint/naming-convention */
import {
  IAuthenticatedRequestFromEmailJwt,
  ICurrentSystemUserFromEmailJwt,
} from 'src/_validators/auth/auth.model';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentSystemUserFromEmailJwt = createParamDecorator<
  keyof ICurrentSystemUserFromEmailJwt,
  undefined | number | string | IAuthenticatedRequestFromEmailJwt['user']
>(
  (
    data: keyof ICurrentSystemUserFromEmailJwt,
    context: ExecutionContext,
  ):
    | IAuthenticatedRequestFromEmailJwt['user']
    | string
    | number
    | undefined => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
