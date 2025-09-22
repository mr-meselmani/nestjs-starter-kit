import {
  IAppEnvConfig,
  IConfigNameSpacedEnvFactory,
  IJwtAndPassportEnvConfig,
  IDatabaseEnvConfig,
  IEmailEnvConfig,
  IMinioEnvConfig,
} from './types';

const defaultExpiresIn = 604800;

export const productionModeEnv: IConfigNameSpacedEnvFactory = {
  app: (): IAppEnvConfig => ({
    frontendBaseUrl: process.env.FRONTEND_BASE_URL!,
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV!,
  }),

  jwtAndPassport: (): IJwtAndPassportEnvConfig => ({
    jwtSecret: process.env.JWT_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    verifyEmailSecret: process.env.VERIFY_EMAIL_SECRET!,
    accessTokenExpiresIn: parseInt(
      process.env.ACCESS_TOKEN_EXPIRES_IN || `${defaultExpiresIn}`,
    ),
    jwtVerifyEmailTokenExpirationTime: parseInt(
      process.env.JWT_VERIFY_EMAIL_TOKEN_EXPIRATION_TIME || '3600',
    ),
    refreshTokenExpiresIn: parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_IN || '1209600',
    ),
  }),
  database: (): IDatabaseEnvConfig => ({
    databaseUrl: process.env.DATABASE_URL!,
  }),

  email: (): IEmailEnvConfig => ({
    resendApiKey: process.env.RESEND_API_KEY!,
    mailerAddress: process.env.MAILER_ADDRESS!,
  }),

  minio: (): IMinioEnvConfig => ({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
  }),
};
