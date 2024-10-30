import { PrismaClient } from '@prisma/client';
import { rolesData } from './data/roles';

export async function seedRoles(prisma: PrismaClient): Promise<void> {
  if ((await prisma.role.count()) < 1) {
    await prisma.role.createMany({
      data: rolesData,
    });
  }
}
