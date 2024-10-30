import { PrismaClient } from '@prisma/client';
import { passwordsData } from './data/passwords';

export default async function seedPasswords(
  prisma: PrismaClient,
): Promise<void> {
  if ((await prisma.password.count()) < 1) {
    await prisma.password.createMany({
      data: passwordsData,
      skipDuplicates: true,
    });
  }
}
