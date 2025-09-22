import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { EmailModule } from './email/email.module';
import { PasswordModule } from './password/password.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { CheckEmailVerificationMiddleware } from './_middlewares/checkEmailVerification.middleware';
import { AUTH_PATHS } from './_paths/auth';
import { OtpAndSecretModule } from './otp-and-secret/otp-and-secret.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import {
  nameSpacedAppConfig,
  nameSpacedJwtAndPassportConfig,
  nameSpacedDatabaseConfig,
  nameSpacedEmailConfig,
} from './_config';
import { validateEnvironment } from './_utils/env-validation.util';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      // https://docs.nestjs.com/techniques/configuration#configuration-namespaces
      load: [
        nameSpacedAppConfig,
        nameSpacedJwtAndPassportConfig,
        nameSpacedDatabaseConfig,
        nameSpacedEmailConfig,
      ],
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'], // Try environment-specific first, then fallback to .env
      validate: validateEnvironment,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    EmailModule,
    PasswordModule,
    RefreshTokenModule,
    OtpAndSecretModule,
    PostModule,
    MinioModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD, // https://docs.nestjs.com/recipes/passport#enable-authentication-globally
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(AppModule.name);

  constructor() {
    this.logger.log('✅ App module initialized with validated configuration');
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CheckEmailVerificationMiddleware).forRoutes({
      path: `${AUTH_PATHS.PATH_PREFIX}/${AUTH_PATHS.POST_SEND_VERIFY_EMAIL_FOR_NEW_USER}`,
      method: RequestMethod.POST,
    });
  }
}
