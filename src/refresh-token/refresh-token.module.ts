import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenClient } from './refresh-token.client';

@Module({
  providers: [RefreshTokenService, RefreshTokenClient],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
