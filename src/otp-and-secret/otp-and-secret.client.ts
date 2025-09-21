import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OTPAndSecret, Prisma } from '@prisma/client';

@Injectable()
export class OtpAndSecretClient {
  constructor(private readonly prisma: PrismaService) {}

  // Get OTPAndSecret by email
  public async getOTPAndSecretByEmail({
    email,
  }: Pick<OTPAndSecret, 'email'>): Promise<OTPAndSecret | null> {
    const oTPAndSecret = await this.prisma.oTPAndSecret.findUnique({
      where: { email },
    });
    return oTPAndSecret;
  }

  // Create or update OTPAndSecret or throw
  public async createOrUpdateOtpAndSecretOrThrow(
    { email, secret }: Pick<OTPAndSecret, 'email' | 'secret'>,
    {
      shouldIncremnetRequestSecretCounter = false,
      shouldResetRequestSecretCounter = false,
      shouldResetRequestSecretCounterToFirstTry = false,
      shouldIncremnetOtpCodeRetryCounter = false,
      shouldResetOtpCodeRetryCounter = false,
    }: {
      shouldIncremnetRequestSecretCounter: boolean;
      shouldResetRequestSecretCounter: boolean;
      shouldResetRequestSecretCounterToFirstTry: boolean;
      shouldIncremnetOtpCodeRetryCounter: boolean;
      shouldResetOtpCodeRetryCounter: boolean;
    },
  ): Promise<void> {
    try {
      await this.prisma.oTPAndSecret.upsert({
        create: {
          email,
          secret,
          otpSecretRequestCount: 1,
        },
        update: {
          secret,
          ...(shouldIncremnetRequestSecretCounter &&
          !shouldResetRequestSecretCounter &&
          !shouldResetRequestSecretCounterToFirstTry
            ? {
                otpSecretRequestCount: {
                  increment: 1,
                },
              }
            : {}),
          ...(shouldResetRequestSecretCounter &&
          !shouldIncremnetRequestSecretCounter &&
          !shouldResetRequestSecretCounterToFirstTry
            ? { otpSecretRequestCount: 0 }
            : {}),
          ...(shouldResetRequestSecretCounterToFirstTry &&
          !shouldIncremnetRequestSecretCounter &&
          !shouldResetRequestSecretCounter
            ? { otpSecretRequestCount: 1 }
            : {}),

          ...(shouldIncremnetOtpCodeRetryCounter &&
          !shouldResetOtpCodeRetryCounter
            ? {
                otpCodeRetryCount: {
                  increment: 1,
                },
              }
            : {}),
          ...(shouldResetOtpCodeRetryCounter &&
          !shouldIncremnetOtpCodeRetryCounter
            ? { otpCodeRetryCount: 0 }
            : {}),
        },
        where: { email },
      });
    } catch (e) {
      Logger.error(e, 'OTPAndSecretClient: createOrUpdateOTPAndSecret');
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Promise.reject(
          new InternalServerErrorException(
            `OTPAndSecretClient: Failed to create OTPAndSecret with error code ${e.code}`,
          ),
        );
      }
      return Promise.reject(
        new InternalServerErrorException(
          `OTPAndSecretClient: Failed to create OTPAndSecret`,
        ),
      );
    }
  }
}
