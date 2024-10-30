import { ForbiddenException, Injectable } from '@nestjs/common';
import { PasswordClient } from './password.client';
import { HashService } from '@/_utils/hash.util';
import { Password, User } from '@prisma/client';

@Injectable()
export class PasswordService {
  constructor(private readonly passwordClient: PasswordClient) {}

  // Hash then create or update password
  public async hashThenCreateOrUpdatePassword({
    userId,
    plainTextPassword,
  }: {
    userId: User['id'];
    plainTextPassword: string;
  }): Promise<void> {
    const { hash, salt } = HashService.generateHash(plainTextPassword);

    await this.passwordClient.createOrUpdatePasswordOrThrow({
      userId,
      hash,
      salt,
    });
  }

  // Get user password by id or null
  public async getUserPasswordbyIdOrNull(
    userId: User['id'],
  ): Promise<Password | null> {
    return this.passwordClient.getUserPasswordByIdOrNull(userId);
  }

  // Check if password is new or throw
  public async checkIfPasswordIsNewOrThrow({
    userId,
    plainTextPassword,
  }: {
    userId: number;
    plainTextPassword: string;
  }): Promise<boolean> {
    const userPassword =
      await this.passwordClient.getUserPasswordByIdOrNull(userId);

    if (!userPassword) {
      return Promise.reject(
        new ForbiddenException('PasswordService: userPassword not found'),
      );
    }

    const isPassword = HashService.compareHash({
      tobeHashed: plainTextPassword,
      storedHash: userPassword.hash,
      storedSalt: userPassword.salt,
    });

    if (isPassword) {
      return Promise.reject(
        new ForbiddenException(
          `PasswordService: checkIfPasswordIsNewOrThrow: You cannot use your old password.`,
        ),
      );
    }

    return isPassword;
  }
}
