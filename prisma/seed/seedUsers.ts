import { PrismaClient } from '@prisma/client';
import { userData } from './data/users';

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  if ((await prisma.user.count()) < 1) {
    await prisma.user.createMany({
      data: userData,
    });
  }
}
