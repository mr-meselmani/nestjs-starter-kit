import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtVerifyEmailGuard extends AuthGuard('jwt-verify-email') {
  constructor() {
    super();
  }
}
