import { PrismaClient } from '@prisma/client';
import { adminsData } from './data/admins';

export async function seedAdmins(prisma: PrismaClient): Promise<void> {
  if ((await prisma.administrator.count()) < 1) {
    await prisma.administrator.createMany({
      data: adminsData,
    });
  }
}
