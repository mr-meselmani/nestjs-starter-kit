import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import {
  ICurrentSystemUserFromEmailJwt,
  VerifyEmailJwtPayloadDecoded,
} from 'src/_validators/auth/auth.model';
import { Request } from 'express';

@Injectable()
export class JwtVerifyEmailStrategy extends PassportStrategy(
  Strategy,
  'jwt-verify-email',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.verifyEmailSecret,
      passReqToCallback: true,
    } as any);
  }

  async validate(
    req: Request,
    payload: VerifyEmailJwtPayloadDecoded,
  ): Promise<ICurrentSystemUserFromEmailJwt> {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
