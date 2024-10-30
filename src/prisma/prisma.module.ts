import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// https://docs.nestjs.com/modules#global-modules
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
