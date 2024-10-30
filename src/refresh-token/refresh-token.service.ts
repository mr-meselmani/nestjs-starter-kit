import { Injectable } from '@nestjs/common';
import { RefreshTokenClient } from './refresh-token.client';
import { HashService } from '@/_utils/hash.util';
import { RefreshToken } from '@prisma/client';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly refreshTokenClient: RefreshTokenClient) {}

  // Create or update refresh token
  public async createOrUpdateRefreshToken({
    userId,
    newRt,
  }: {
    userId: number;
    newRt: string;
  }): Promise<void> {
    const { hash, salt } = HashService.generateHash(newRt);
    await this.refreshTokenClient.createOrUpdateRefreshTokenOrThrow({
      userId,
      hash,
      salt,
    });
  }

  // Delete refresh token by user id
  public async deleteRefreshTokenByUserId(userId: number): Promise<void> {
    return this.refreshTokenClient.deleteRefreshTokenByUserId(userId);
  }

  // Get refresh token by user id or null
  public async getRefreshTokenByUserIdOrNull(
    userId: number,
  ): Promise<RefreshToken | null> {
    return this.refreshTokenClient.getRefreshTokenByUserIdOrNull(userId);
  }
}
