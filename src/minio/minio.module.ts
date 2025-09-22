import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { nameSpacedMinioConfig } from '../_config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(nameSpacedMinioConfig)],
  controllers: [MinioController],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
