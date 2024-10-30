import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma, RefreshToken } from '@prisma/client';

@Injectable()
export class RefreshTokenClient {
  constructor(private readonly prisma: PrismaService) {}

  // Create or update refresh token
  public async createOrUpdateRefreshTokenOrThrow({
    userId,
    hash, // hashed RefreshJWT
    salt,
  }: Pick<RefreshToken, 'userId' | 'hash' | 'salt'>): Promise<void> {
    try {
      const result = await this.prisma.refreshToken.upsert({
        create: {
          userId,
          hash,
          salt,
        },
        update: {
          hash,
          salt,
        },
        where: { userId },
      });
      if (!result) {
        return Promise.reject(
          new InternalServerErrorException(
            `RefreshTokenClient: Unknown error occurred creating or updating RefreshToken`,
          ),
        );
      }
    } catch (e) {
      Logger.error(e, 'RefreshTokenClient: createOrUpdateRefreshToken');
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Promise.reject(
          new InternalServerErrorException(
            `RefreshTokenService: Failed to create or update RefreshToken with error code ${e.code}`,
          ),
        );
      }
      return Promise.reject(
        new InternalServerErrorException(
          `RefreshTokenService: Failed to create or update RefreshToken `,
        ),
      );
    }
  }

  // Delete refresh token by user id
  public async deleteRefreshTokenByUserId(userId: number): Promise<void> {
    try {
      await this.prisma.refreshToken.delete({
        where: {
          userId,
        },
      });
    } catch (e) {
      throw e;
    }
  }

  // Get refresh token by user id or null
  public async getRefreshTokenByUserIdOrNull(
    userId: number,
  ): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: {
        userId,
      },
    });
  }
}
