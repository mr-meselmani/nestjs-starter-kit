/* eslint-disable @typescript-eslint/no-explicit-any */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  AccessOrRefreshJwtPayloadJwtPayloadDecoded,
  ICurrentSystemUserIdWithRt,
} from '@/_validators/auth/auth.model';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: AccessOrRefreshJwtPayloadJwtPayloadDecoded,
  ): Promise<ICurrentSystemUserIdWithRt> {
    const refreshToken = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken)
      return Promise.reject(new ForbiddenException('Refresh token malformed'));

    return {
      id: payload.sub,
      refreshToken,
    };
  }
}
