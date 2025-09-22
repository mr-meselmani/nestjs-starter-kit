export enum NODE_ENV_MODES {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export enum CONFIG_NAME_SPACED {
  APP_ENV = 'appenv',
  JWT_AND_PASSPORT = 'jwtandpassportenv',
  DATABASE = 'databaseenv',
  EMAIL = 'emailenv',
}

export enum CUSTOM_PROVIDERS_INJECTION_TOKENS {
  APP_SETTINGS = 'APP_SETTINGS',
  JWT_AND_PASSPORT = 'JWT_AND_PASSPORT',
  DATABASE = 'databaseenv',
  EMAIL = 'emailenv',
}

export interface IAppEnvConfig {
  frontendBaseUrl: string;
  port: number;
  nodeEnv: string;
}

export interface IJwtAndPassportEnvConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  verifyEmailSecret: string;
  accessTokenExpiresIn: number;
  jwtVerifyEmailTokenExpirationTime: number;
  refreshTokenExpiresIn: number;
}


export interface IDatabaseEnvConfig {
  databaseUrl: string;
}

export interface IEmailEnvConfig {
  resendApiKey: string;
  mailerAddress: string;
}

export interface IConfigNameSpacedEnvFactory {
  app: () => IAppEnvConfig;
  jwtAndPassport: () => IJwtAndPassportEnvConfig;
  database: () => IDatabaseEnvConfig;
  email: () => IEmailEnvConfig;
}
