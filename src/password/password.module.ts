import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordClient } from './password.client';

@Module({
  providers: [PasswordService, PasswordClient],
  exports: [PasswordService],
})
export class PasswordModule {}
