/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import {
  AccessOrRefreshJwtPayloadJwtPayloadDecoded,
  ICurrentSystemUser,
} from 'src/_validators/auth/auth.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.jwtSecret,
    } as any);
  }

  async validate(
    payload: AccessOrRefreshJwtPayloadJwtPayloadDecoded,
  ): Promise<ICurrentSystemUser> {
    const user = await this.userService.getUserByIdOrNull(payload.sub);

    if (!user) {
      throw new UnauthorizedException(`JWT Strategy: UnAuthorized`);
    }

    return {
      id: payload.sub,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      newEmail: user.newEmail,
      status: user.status,
      type: user.type,
      image: user.image,
    };
  }
}
