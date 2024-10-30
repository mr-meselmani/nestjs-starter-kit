import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Password, Prisma, User } from '@prisma/client';

@Injectable()
export class PasswordClient {
  constructor(private readonly prisma: PrismaService) {}

  // Create or update password or throw
  public async createOrUpdatePasswordOrThrow({
    userId,
    hash,
    salt,
  }: Pick<Password, 'userId' | 'hash' | 'salt'>): Promise<void> {
    try {
      const result = await this.prisma.password.upsert({
        create: {
          userId,
          hash,
          salt,
        },
        update: {
          hash,
          salt,
        },
        where: {
          userId,
        },
      });

      if (!result) {
        return Promise.reject(
          new InternalServerErrorException(
            `PasswordClient: failed to create or update password`,
          ),
        );
      }
    } catch (e) {
      Logger.error(e, `PasswordClient: createOrUpdatePasswordOrThrow`);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Promise.reject(
          new InternalServerErrorException(
            `PasswordClient: failed to create password with code: ${e.code}`,
          ),
        );
      }

      return Promise.reject(
        new InternalServerErrorException(
          `PasswordClient: failed to create password`,
        ),
      );
    }
  }

  // Get user password by id or null
  public async getUserPasswordByIdOrNull(
    userId: User['id'],
  ): Promise<Password | null> {
    const userPassword = await this.prisma.password.findUnique({
      where: {
        userId,
      },
    });

    return userPassword;
  }
}
