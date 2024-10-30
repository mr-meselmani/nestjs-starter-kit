import { createZodDto } from 'nestjs-zod';
import {
  changeEmailSchema,
  changePasswordBodySchema,
  loginBodySchema,
  loginUserResponseSchema,
  refreshTokenResponseSchema,
  registerUserBodySchema,
  registerUserResponseSchema,
  resetPasswordSchema,
  sendOtpEmailSchema,
  sendVerifyEmailBodySchema,
  sendVerifyNewEmailBodySchema,
  verifyOTPSchema,
} from './auth.schema';

export class RegisterUserBodyDto extends createZodDto(registerUserBodySchema) {}

export class LoginBodyDto extends createZodDto(loginBodySchema) {}

export class RegisterUserResponseDto extends createZodDto(
  registerUserResponseSchema,
) {}

export class LoginUserResponseDto extends createZodDto(
  loginUserResponseSchema,
) {}

export class RefreshTokenResponseDto extends createZodDto(
  refreshTokenResponseSchema,
) {}

export class SendVerifyEmailBodyDto extends createZodDto(
  sendVerifyEmailBodySchema,
) {}

export class SendVerifyNewEmailBodyDto extends createZodDto(
  sendVerifyNewEmailBodySchema,
) {}

export class ChangePasswordBodyDto extends createZodDto(
  changePasswordBodySchema,
) {}

export class ChangeEmailDto extends createZodDto(changeEmailSchema) {}

export class SendOtpEmailBodyDto extends createZodDto(sendOtpEmailSchema) {}

export class VerifyOTPBodyDto extends createZodDto(verifyOTPSchema) {}

export class ResetPasswordBodyDto extends createZodDto(resetPasswordSchema) {}
