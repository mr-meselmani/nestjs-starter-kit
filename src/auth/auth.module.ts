import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { PasswordModule } from 'src/password/password.module';
import { EmailModule } from 'src/email/email.module';
import { JwtVerifyEmailStrategy } from './strategies/jwt-verify-email.strategy';
import { OtpAndSecretModule } from 'src/otp-and-secret/otp-and-secret.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    RefreshTokenModule,
    PasswordModule,
    EmailModule,
    OtpAndSecretModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtVerifyEmailStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
