/**
 * All environment variables for the application
 * These variables are validated on app startup
 */
export const ENV_VARS = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'FRONTEND_BASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'VERIFY_EMAIL_SECRET',
  'ACCESS_TOKEN_EXPIRES_IN',
  'JWT_VERIFY_EMAIL_TOKEN_EXPIRATION_TIME',
  'REFRESH_TOKEN_EXPIRES_IN',
  'RESEND_API_KEY',
  'MAILER_ADDRESS',
  'MINIO_ENDPOINT',
  'MINIO_PORT',
  'MINIO_USE_SSL',
  'MINIO_ACCESS_KEY',
  'MINIO_SECRET_KEY',
];
