import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserClient } from './user.client';
import { PasswordModule } from '@/password/password.module';

@Module({
  imports: [PasswordModule],
  controllers: [UserController],
  providers: [UserService, UserClient],
  exports: [UserService],
})
export class UserModule {}
