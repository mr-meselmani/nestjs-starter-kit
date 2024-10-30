/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { SetMetadata } from '@nestjs/common';

// https://docs.nestjs.com/recipes/passport#enable-authentication-globally
export const IS_PUBLIC_KEY = 'isPublic';
export const PublicEndpoint = () => SetMetadata(IS_PUBLIC_KEY, true);
