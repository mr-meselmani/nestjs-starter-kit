/* eslint-disable @typescript-eslint/no-explicit-any */
import { AUTH_PATHS } from '@/_paths/auth';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicEndpoint } from '@/_decorators/setters/publicEndpoint.decorator';
import {
  ChangeEmailDto,
  ChangePasswordBodyDto,
  LoginBodyDto,
  LoginUserResponseDto,
  RefreshTokenResponseDto,
  RegisterUserBodyDto,
  RegisterUserResponseDto,
  ResetPasswordBodyDto,
  SendOtpEmailBodyDto,
  SendVerifyEmailBodyDto,
  SendVerifyNewEmailBodyDto,
  VerifyOTPBodyDto,
} from '@/_validators/auth/auth.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentSystemUser } from '@/_decorators/getters/currentSystemUser.decorator';
import {
  ICurrentSystemUser,
  ICurrentSystemUserFromEmailJwt,
  ICurrentSystemUserIdWithRt,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '@/_validators/auth/auth.model';
import { CurrentSystemUserFromRt } from '@/_decorators/getters/currentSystemUserFromRt.decorator';
import { JwtVerifyEmailGuard } from './guards/jwt-verify-email.guard';
import { CurrentSystemUserFromEmailJwt } from '@/_decorators/getters/currentSystemUserFromEmailJwt.decorator';
import { IApiResponse } from '@/_validators/global/global.model';
import { User } from '@prisma/client';
import { ZodSerializerDto } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';
import { CustomSwaggerDecorator } from '@/_decorators/setters/swagger.decorator';

@ApiTags(AUTH_PATHS.PATH_PREFIX)
@Controller(AUTH_PATHS.PATH_PREFIX)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: RegisterUserBodyDto.schema,
    },
    resDec: {
      responseSchema: RegisterUserResponseDto.schema,
    },
    conflictDec: true,
    createdDec: true,
  })
  @PublicEndpoint()
  @Post(AUTH_PATHS.REGISTER)
  @ZodSerializerDto(RegisterUserResponseDto)
  public async register(
    @Body() registerPayload: RegisterUserBodyDto,
  ): Promise<IApiResponse<User>> {
    return {
      message: 'success',
      data: await this.authService.register(registerPayload),
    };
  }

  // Login
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: LoginBodyDto.schema,
    },
    resDec: {
      responseSchema: LoginUserResponseDto.schema,
    },
    statusOK: true,
  })
  @PublicEndpoint()
  @Post(AUTH_PATHS.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(LoginUserResponseDto)
  public async login(
    @Body() loginPayload: LoginBodyDto,
  ): Promise<IApiResponse<ILoginUserResponse>> {
    return {
      message: 'success',
      data: await this.authService.login(loginPayload),
    };
  }

  // Logout
  @CustomSwaggerDecorator({
    authDec: true,
    unauthDec: true,
    statusOK: true,
  })
  @Post(AUTH_PATHS.LOGOUT)
  @HttpCode(HttpStatus.OK)
  public async logout(
    @CurrentSystemUser() { id }: ICurrentSystemUser,
  ): Promise<IApiResponse<string>> {
    return {
      message: 'success',
      data: await this.authService.logout(id),
    };
  }

  // Refresh token
  @CustomSwaggerDecorator({
    resDec: {
      responseSchema: RefreshTokenResponseDto.schema,
    },
    authDec: true,
    unauthDec: true,
    statusOK: true,
  })
  @PublicEndpoint()
  @UseGuards(JwtRefreshGuard)
  @Post(AUTH_PATHS.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResponseDto)
  public async refreshToken(
    @CurrentSystemUserFromRt() { id, refreshToken }: ICurrentSystemUserIdWithRt,
  ): Promise<IApiResponse<IRefreshTokenResponse>> {
    return {
      message: 'success',
      data: await this.authService.refreshToken({
        id,
        refreshToken,
      }),
    };
  }

  // Send verify email for new user
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: SendVerifyEmailBodyDto.schema,
    },
    statusOK: true,
  })
  @PublicEndpoint()
  @Post(AUTH_PATHS.POST_SEND_VERIFY_EMAIL_FOR_NEW_USER)
  @HttpCode(HttpStatus.OK)
  public async sendVerifyEmailForNewUser(
    @Body() { email }: SendVerifyEmailBodyDto,
  ): Promise<IApiResponse<string>> {
    return {
      message: 'success',
      data: await this.authService.sendVerifyEmailForNewUser({ email }),
    };
  }

  // Verify email for new user
  @CustomSwaggerDecorator({
    statusOK: true,
  })
  @PublicEndpoint()
  @UseGuards(JwtVerifyEmailGuard)
  @Post(AUTH_PATHS.POST_VERIFY_EMAIL_FOR_NEW_USER)
  @HttpCode(HttpStatus.OK)
  public async verifyEmailForNewUser(
    @CurrentSystemUserFromEmailJwt() { id }: ICurrentSystemUserFromEmailJwt,
  ): Promise<IApiResponse<string>> {
    return {
      message: 'success',
      data: await this.authService.verifyEmailForNewUser(id),
    };
  }

  // Change email & send verify new email
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: ChangeEmailDto.schema,
    },
    authDec: true,
    unauthDec: true,
    statusOK: true,
  })
  @Put(AUTH_PATHS.PUT_CHANGE_EMAIL)
  public async changeEmailAndSendVerifyNewEmail(
    @CurrentSystemUser() { id }: ICurrentSystemUser,
    @Body() { newEmail }: ChangeEmailDto,
  ): Promise<IApiResponse<string>> {
    return {
      message: 'success',
      data: await this.authService.changeEmailAndSendVerifyNewEmail({
        userId: id,
        newEmail,
      }),
    };
  }

  // Send verify new email
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: SendVerifyNewEmailBodyDto.schema,
    },
    authDec: true,
    unauthDec: true,
    statusOK: true,
  })
  @Post(AUTH_PATHS.POST_SEND_VERIFY_NEW_EMAIL)
  @HttpCode(HttpStatus.OK)
  public async sendVerifyNewEmail(
    @CurrentSystemUser() { id }: ICurrentSystemUser,
    @Body() { newEmail }: SendVerifyNewEmailBodyDto,
  ): Promise<IApiResponse<string>> {
    return {
      message: 'success',
      data: await this.authService.sendVerifyNewEmail({ newEmail, userId: id }),
    };
  }

  // Verify new email
  @CustomSwaggerDecorator({
    statusOK: true,
  })
  @PublicEndpoint()
  @UseGuards(JwtVerifyEmailGuard)
  @Post(AUTH_PATHS.POST_VERIFY_NEW_EMAIL)
  @HttpCode(HttpStatus.OK)
  public async verifyNewEmail(
    @CurrentSystemUserFromEmailJwt()
    { id, email: newEmail }: ICurrentSystemUserFromEmailJwt,
  ): Promise<IApiResponse<string>> {
    return {
      message: 'success',
      data: await this.authService.changeEmailToNewEmail({
        userId: id,
        newEmail: newEmail,
      }),
    };
  }

  // Change password
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: ChangePasswordBodyDto.schema,
    },
    authDec: true,
    unauthDec: true,
    statusOK: true,
  })
  @Put(AUTH_PATHS.PUT_CHANGE_PASSWORD)
  public async changePassword(
    @CurrentSystemUser() { id }: ICurrentSystemUser,
    @Body() { newPassword }: ChangePasswordBodyDto,
  ): Promise<IApiResponse<string>> {
    return {
      message: 'success',
      data: await this.authService.changePassword({
        userId: id,
        plainTextPassword: newPassword,
      }),
    };
  }

  // Send otp email
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: SendOtpEmailBodyDto.schema,
    },
    statusOK: true,
  })
  @PublicEndpoint()
  @Post(AUTH_PATHS.POST_SEND_OTP_EMAIL)
  @HttpCode(HttpStatus.OK)
  public async sendOtpEmail(
    @Body() { email }: SendOtpEmailBodyDto,
  ): Promise<IApiResponse<string>> {
    await this.authService.sendOtpEmail({ email });

    return {
      message: 'OTP email sent',
    };
  }

  // Verify otp
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: VerifyOTPBodyDto.schema,
    },
    statusOK: true,
  })
  @PublicEndpoint()
  @Post(AUTH_PATHS.POST_VERIFY_OTP)
  @HttpCode(HttpStatus.OK)
  public async verifyOtp(
    @Body() { otpCode, email }: VerifyOTPBodyDto,
  ): Promise<IApiResponse<boolean>> {
    return {
      message: 'success',
      data: await this.authService.verifyOtpOrThrow({
        otpCode,
        email,
      }),
    };
  }

  // Reset password & verify otp
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: ResetPasswordBodyDto.schema,
    },
    statusOK: true,
  })
  @PublicEndpoint()
  @Post(AUTH_PATHS.POST_RESET_PASSWORD)
  @HttpCode(HttpStatus.OK)
  public async resetPassword(
    @Body()
    { otpCode, email, newPassword, confirmNewPassword }: ResetPasswordBodyDto,
  ): Promise<IApiResponse<string>> {
    await this.authService.resetPassword({
      otpCode,
      email,
      newPassword,
      confirmNewPassword,
    });

    return {
      message: 'Password reset success.',
    };
  }
}
