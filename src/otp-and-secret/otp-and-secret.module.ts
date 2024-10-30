import { Module } from '@nestjs/common';
import { OtpAndSecretService } from './otp-and-secret.service';
import { OtpAndSecretClient } from './otp-and-secret.client';

@Module({
  providers: [OtpAndSecretService, OtpAndSecretClient],
  exports: [OtpAndSecretService],
})
export class OtpAndSecretModule {}
