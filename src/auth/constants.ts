/* eslint-disable no-console */
export const jwtConstants = {
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  verifyEmailSecret: process.env.VERIFY_EMAIL_SECRET,
  jwtVerifyEmailTokenExpirationTime: process.env
    .JWT_VERIFY_EMAIL_TOKEN_EXPIRATION_TIME
    ? parseInt(process.env.JWT_VERIFY_EMAIL_TOKEN_EXPIRATION_TIME, 10)
    : 60 * 30,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    ? parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN, 10)
    : 60 * 60 * 24 * 7,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
    ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10)
    : 60 * 60 * 24 * 30,
};

console.log(jwtConstants);
