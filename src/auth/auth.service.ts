/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ILoginBody,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IRegisterUserBody,
  IResetPasswordBody,
  ISendOtpEmailBody,
  ITokens,
  VerifyEmailJwtPayload,
} from '@/_validators/auth/auth.model';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { User, UserStatus } from '@prisma/client';
import { PasswordService } from '@/password/password.service';
import { HashService } from '@/_utils/hash.util';
import { AUTH_PATHS } from '@/_paths/auth';
import { EmailService } from '@/email/email.service';
import verifyEmailEdm from '@/email/assets/verifyEmailTemplate';
import { OtpAndSecretService } from '@/otp-and-secret/otp-and-secret.service';
import { authenticator } from 'otplib';
import resetPasswordEdm from '@/email/assets/resetPasswordEmailTemplate';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly passwordService: PasswordService,
    private readonly emailService: EmailService,
    private readonly otpAndSecretService: OtpAndSecretService,
  ) {}

  // Register
  public async register(registerPayload: IRegisterUserBody): Promise<User> {
    const createdUser = await this.userService.createUserOrThrow({
      firstName: registerPayload.firstName,
      lastName: registerPayload.lastName,
      email: registerPayload.email,
      password: registerPayload.password,
    });

    Logger.log(`AuthService: user with email: ${createdUser.email} created`);

    // send verify email for new user
    await this.sendVerifyEmailForNewUser({
      email: registerPayload.email,
    });

    return createdUser;
  }

  // Login
  public async login(loginPayload: ILoginBody): Promise<ILoginUserResponse> {
    const user = await this.userService.getUserByEmailOrNull(
      loginPayload.email,
    );

    if (!user) {
      Logger.error(`user with email: ${loginPayload.email} not found`);

      return Promise.reject(new UnauthorizedException(`AuthService: login1`));
    }

    // get user password
    const userPassword = await this.passwordService.getUserPasswordbyIdOrNull(
      user.id,
    );

    if (!userPassword) {
      Logger.error(`user password with email: ${loginPayload.email} not found`);

      return Promise.reject(new UnauthorizedException(`AuthService: login2`));
    }

    const passwordMatches = HashService.compareHash({
      storedHash: userPassword.hash,
      storedSalt: userPassword.salt,
      tobeHashed: loginPayload.password,
    });

    if (!passwordMatches) {
      Logger.error(`user password with email: ${loginPayload.email} not match`);

      return Promise.reject(new UnauthorizedException(`AuthService: login3`));
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.refreshTokenService.createOrUpdateRefreshToken({
      userId: user.id,
      newRt: tokens.refreshToken,
    });

    await this.userService.updateUserStatusToActive(user.id);

    return {
      user,
      tokens,
    };
  }

  // Logout
  public async logout(userId: number): Promise<string> {
    await this.refreshTokenService.deleteRefreshTokenByUserId(userId);

    return `Logged out successfully`;
  }

  // Refresh token
  public async refreshToken({
    id,
    refreshToken,
  }: {
    id: number;
    refreshToken: string;
  }): Promise<IRefreshTokenResponse> {
    const user = await this.userService.getUserByIdOrNull(id);

    if (!user) {
      return Promise.reject(
        new UnauthorizedException(`AuthService: user not found refreshToken1`),
      );
    }

    const userRT =
      await this.refreshTokenService.getRefreshTokenByUserIdOrNull(id);

    if (!userRT) {
      return Promise.reject(
        new ForbiddenException(
          `AuthService: refreshToken not found refreshToken2`,
        ),
      );
    }

    const rtMatches = HashService.compareHash({
      storedHash: userRT.hash,
      storedSalt: userRT.salt,
      tobeHashed: refreshToken,
    });

    if (!rtMatches) {
      return Promise.reject(
        new ForbiddenException(
          `AuthService: refreshToken not match refreshToken 3`,
        ),
      );
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.refreshTokenService.createOrUpdateRefreshToken({
      userId: user.id,
      newRt: tokens.refreshToken,
    });

    return {
      user,
      tokens,
    };
  }

  // Generate access & refresh tokens
  private async generateTokens(
    userId: number,
    email: string,
  ): Promise<ITokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConstants.jwtSecret,
          expiresIn: jwtConstants.accessTokenExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConstants.jwtRefreshSecret,
          expiresIn: jwtConstants.refreshTokenExpiresIn,
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
      accessTokenExpiresIn: jwtConstants.accessTokenExpiresIn,
    };
  }

  // Send verify email for new user
  public async sendVerifyEmailForNewUser({
    email,
  }: Pick<User, 'email'>): Promise<string> {
    const user = await this.userService.getUserByEmailOrNull(email);

    if (!user) {
      return Promise.reject(
        new ForbiddenException(
          `AuthService: we don't find an associated user with this email: ${email}`,
        ),
      );
    }

    // Send verify email or throw
    return this.sendVerifyEmailOrThrow({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      type: user.type,
      apiEndPoint: AUTH_PATHS.POST_VERIFY_EMAIL_FOR_NEW_USER,
    });
  }

  // Send verify email or throw
  public async sendVerifyEmailOrThrow({
    id,
    email,
    apiEndPoint,
    type,
  }: Pick<User, 'id' | 'email' | 'firstName' | 'type'> & {
    apiEndPoint:
      | AUTH_PATHS.POST_VERIFY_EMAIL_FOR_NEW_USER
      | AUTH_PATHS.POST_VERIFY_NEW_EMAIL;
  }): Promise<string> {
    const verifyEmailToken = await this.generateVerifyEmailToken({
      id,
      email,
    });

    const sendEmailSubPath =
      apiEndPoint === AUTH_PATHS.POST_VERIFY_EMAIL_FOR_NEW_USER
        ? `${apiEndPoint}`
        : null;

    await this.emailService.sendEmailOrThrow({
      to: [email],
      subject: 'Verify your email',
      html: verifyEmailEdm(
        `${process.env.FRONTEND_BASE_URL}/auth/${sendEmailSubPath}?token=${verifyEmailToken}&email=${email}`,
      ),
    });

    return `Verify email sent successfully`;
  }

  // Generate verify email token
  private async generateVerifyEmailToken({
    id,
    email,
  }: Pick<User, 'id' | 'email'>): Promise<string> {
    const jwtPayload: VerifyEmailJwtPayload = {
      sub: id,
      email: email.toLowerCase(),
    };

    return this.jwtService.signAsync(jwtPayload, {
      secret: jwtConstants.verifyEmailSecret,
      expiresIn: jwtConstants.jwtVerifyEmailTokenExpirationTime,
    });
  }

  // Verify email for new user
  public async verifyEmailForNewUser(userId: User['id']): Promise<string> {
    const user = await this.userService.getUserByIdOrNull(userId);

    if (!user) {
      return Promise.reject(
        new ForbiddenException(
          `AuthService: user not found verifyEmailForNewUser1`,
        ),
      );
    }

    if (user.status === UserStatus.ACTIVE) {
      return Promise.reject(
        new ForbiddenException(
          `AuthService: user already verified verifyEmailForNewUser2`,
        ),
      );
    }

    // update user status to active
    await this.userService.updateUserStatusToActive(user.id);

    return `Email verified successfully`;
  }

  // Change email to new email
  public async changeEmailToNewEmail({
    userId,
    newEmail,
  }: {
    userId: User['id'];
    newEmail: User['newEmail'];
  }): Promise<string> {
    const user = await this.userService.getUserByIdOrNull(userId);

    if (!user) {
      return Promise.reject(
        new ForbiddenException(
          'AuthService: changeEmailToNewEmail1: user not found',
        ),
      );
    }

    // if user is not attempting to change his email dont send email
    if (!user.newEmail) {
      return Promise.reject(
        new ForbiddenException('AuthService: changeEmailToNewEmail2'),
      );
    }

    // just incase
    if (user?.newEmail && newEmail !== user.newEmail) {
      return Promise.reject(
        new ForbiddenException('AuthService: changeEmailToNewEmail3'),
      );
    }

    await this.userService.checkIfChangeEmailIsNotAllowedOrThrow({
      id: userId,
      email: newEmail ?? '',
    });

    await this.userService.changeEmail(userId, {
      email: user.newEmail,
      newEmail: null,
      status: UserStatus.ACTIVE,
    });

    return `Changed email successfully`;
  }

  // Send verify new email
  public async sendVerifyNewEmail({
    newEmail,
    userId,
  }: {
    newEmail: User['newEmail'];
    userId: User['id'];
  }): Promise<string> {
    await this.userService.checkIfChangeEmailIsNotAllowedOrThrow({
      id: userId,
      email: newEmail ?? '',
    });

    const user = await this.userService.getUserByIdOrNull(userId);

    if (!user) {
      return Promise.reject(
        new BadRequestException(`AuthService: sendVerifyNewEmail1`),
      );
    }

    // if user is not attempting to change his email dont send email
    if (!user.newEmail) {
      return Promise.reject(
        new BadRequestException(`AuthService: sendVerifyNewEmail2`),
      );
    }

    return this.sendVerifyEmailOrThrow({
      id: userId,
      email: newEmail ?? '',
      firstName: user.firstName,
      type: user.type,
      apiEndPoint: AUTH_PATHS.POST_VERIFY_NEW_EMAIL,
    });
  }

  // Change email and send verify new email
  public async changeEmailAndSendVerifyNewEmail({
    userId,
    newEmail,
  }: {
    userId: User['id'];
    newEmail: User['newEmail'];
  }): Promise<string> {
    await this.userService.checkIfChangeEmailIsNotAllowedOrThrow({
      id: userId,
      email: newEmail ?? '',
    });

    const user = await this.userService.getUserByIdOrNull(userId);

    if (!user) {
      return Promise.reject(
        new ForbiddenException(
          `AuthService: changeEmailAndSendVerifyNewEmail1`,
        ),
      );
    }

    await this.userService.changeEmail(userId, {
      newEmail,
    });

    return this.sendVerifyEmailOrThrow({
      id: userId,
      email: newEmail ?? '',
      firstName: user.firstName,
      type: user.type,
      apiEndPoint: AUTH_PATHS.POST_VERIFY_NEW_EMAIL,
    });
  }

  // Change password
  public async changePassword({
    userId,
    plainTextPassword,
  }: {
    userId: User['id'];
    plainTextPassword: string;
  }): Promise<string> {
    await this.passwordService.hashThenCreateOrUpdatePassword({
      userId,
      plainTextPassword,
    });

    return `Password updated successfully`;
  }

  // Send otp email
  public async sendOtpEmail({ email }: ISendOtpEmailBody): Promise<void> {
    const user = await this.userService.getUserByEmailOrNull(email);

    if (!user) {
      return;
    }

    const otpSecret = await this.otpAndSecretService.getOTPAndSecretByEmail({
      email,
    });

    const maxRequestCount: number = 3;
    const currentTimeStamp = new Date().getTime();
    let shouldIncremnetRequestSecretCounter = false;
    let shouldResetRequestSecretCounterToFirstTry = false;
    let shouldResetOtpCodeRetryCounter = false;

    if (otpSecret) {
      if (
        currentTimeStamp - otpSecret.updated.getTime() <
        24 * 60 * 60 * 1000
      ) {
        if (otpSecret.otpSecretRequestCount >= maxRequestCount) {
          return Promise.reject(
            new ForbiddenException('AuthService: sendOTPEmail1'),
          );
        } else {
          shouldIncremnetRequestSecretCounter = true;
          shouldResetOtpCodeRetryCounter = true;
        }
      } else {
        // reset both after some period (1 day) has passed
        shouldResetRequestSecretCounterToFirstTry = true;
        shouldResetOtpCodeRetryCounter = true;
      }
    }

    // AuthenticatorOptions interface extends TOTPOptions which in turn extends HOTPOptions
    // https://www.npmjs.com/package/otplib#authenticator-options
    // https://www.npmjs.com/package/otplib#hotp-options
    // https://www.npmjs.com/package/otplib#totp-options
    authenticator.options = {
      digits: 4, // use The options setter; we need otp code to be 4 digits
      step: 1800, // half an hour
      window: 1,
    };

    let oTPSecret: string, otpCode: string, otpCodeInteger: number;

    do {
      // Generate OTP secret
      oTPSecret = authenticator.generateSecret();

      // Generate OTP 4-digit code
      otpCode = authenticator.generate(oTPSecret);

      // Parse OTP code to integer
      otpCodeInteger = parseInt(otpCode);
    } while (otpCode[0] === '0'); // retry if otp code starts with 0 (causing issues in email template and when sending it as json in request)

    // make sure otp code is integer just in case
    if (isNaN(otpCodeInteger)) {
      return Promise.reject(
        new ForbiddenException('AuthService: sendOTPEmail2'),
      );
    }

    // save otp secret to database
    await this.otpAndSecretService.createOrUpdateOtpAndSecretOrThrow(
      {
        email,
        secret: oTPSecret,
      },
      {
        shouldIncremnetRequestSecretCounter,
        shouldResetRequestSecretCounter: false,
        shouldResetRequestSecretCounterToFirstTry,
        shouldIncremnetOtpCodeRetryCounter: false,
        shouldResetOtpCodeRetryCounter,
      },
    );

    return this.emailService.sendEmailOrThrow({
      to: [email],
      subject: `Reset Your Password, ${user.firstName}`,
      html: resetPasswordEdm(otpCodeInteger),
    });
  }

  // Verify otp or throw
  public async verifyOtpOrThrow(
    {
      otpCode,
      email,
    }: {
      otpCode: number;
      email: string;
    },
    isResetingPassword = false,
  ): Promise<boolean> {
    const user = await this.userService.getUserByEmailOrNull(email);

    if (!user) {
      return Promise.reject(
        new ForbiddenException('AuthService: verifyOtpOrThrow1'),
      );
    }

    const otpSecret = await this.otpAndSecretService.getOTPAndSecretByEmail({
      email,
    });

    if (!otpSecret) {
      return Promise.reject(
        new NotFoundException(
          'AuthService: verifyOtpOrThrow2: secret was not found',
        ),
      );
    }

    const maxRequestCount: number = 3;
    let shouldIncremnetOtpCodeRetryCounter = false;

    if (
      (isResetingPassword && otpSecret.otpCodeRetryCount > maxRequestCount) ||
      (!isResetingPassword && otpSecret.otpCodeRetryCount >= maxRequestCount)
    ) {
      return Promise.reject(
        new ForbiddenException(
          'AuthService: verifyOtpOrThrow3: verifyOTP: 429 Too Many Requests',
        ),
      );
    }

    // note: use authenticator.check to check validation without expiry
    const isValid = authenticator.verify({
      token: otpCode.toString(),
      secret: otpSecret.secret,
    });

    if (!isValid) {
      shouldIncremnetOtpCodeRetryCounter = true;
      // save otp secret to database
      await this.otpAndSecretService.createOrUpdateOtpAndSecretOrThrow(
        {
          email,
          secret: otpSecret.secret,
        },
        {
          shouldIncremnetRequestSecretCounter: false,
          shouldResetRequestSecretCounter: false,
          shouldResetRequestSecretCounterToFirstTry: false,
          shouldIncremnetOtpCodeRetryCounter,
          shouldResetOtpCodeRetryCounter: false,
        },
      );
      return Promise.reject(
        new ForbiddenException(
          'AuthService: verifyOtpOrThrow4: otpCode is not valid',
        ),
      );
    } else {
      // !even if otp secret is valid we should increment the retry , so that user don't use the same secret to change the password for indifinitly for the rest of otp life time
      shouldIncremnetOtpCodeRetryCounter = true;
      await this.otpAndSecretService.createOrUpdateOtpAndSecretOrThrow(
        {
          email,
          secret: otpSecret.secret,
        },
        {
          shouldIncremnetRequestSecretCounter: false,
          shouldResetRequestSecretCounter: false,
          shouldResetRequestSecretCounterToFirstTry: false,
          shouldIncremnetOtpCodeRetryCounter,
          shouldResetOtpCodeRetryCounter: false,
        },
      );
      return isValid;
    }
  }

  // Reset password
  public async resetPassword({
    otpCode,
    email,
    newPassword,
  }: IResetPasswordBody): Promise<void> {
    const user = await this.userService.getUserByEmailOrNull(email);

    if (!user) {
      return Promise.reject(
        new ForbiddenException('AuthService: resetPassword1'),
      );
    }

    await this.passwordService.checkIfPasswordIsNewOrThrow({
      userId: user.id,
      plainTextPassword: newPassword,
    });

    await this.verifyOtpOrThrow(
      {
        otpCode,
        email,
      },
      true,
    );

    await this.passwordService.hashThenCreateOrUpdatePassword({
      userId: user.id,
      plainTextPassword: newPassword,
    });
  }
}
