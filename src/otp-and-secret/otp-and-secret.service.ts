import { Injectable } from '@nestjs/common';
import { OtpAndSecretClient } from './otp-and-secret.client';
import { OTPAndSecret } from '@prisma/client';

@Injectable()
export class OtpAndSecretService {
  constructor(private readonly optAndSecretClient: OtpAndSecretClient) {}

  // Get OTPAndSecret by email
  public async getOTPAndSecretByEmail({
    email,
  }: Pick<OTPAndSecret, 'email'>): Promise<OTPAndSecret | null> {
    return this.optAndSecretClient.getOTPAndSecretByEmail({
      email,
    });
  }

  // Create or update OtpAndSecret or throw
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
    return this.optAndSecretClient.createOrUpdateOtpAndSecretOrThrow(
      {
        email,
        secret,
      },
      {
        shouldIncremnetOtpCodeRetryCounter,
        shouldIncremnetRequestSecretCounter,
        shouldResetOtpCodeRetryCounter,
        shouldResetRequestSecretCounter,
        shouldResetRequestSecretCounterToFirstTry,
      },
    );
  }
}
