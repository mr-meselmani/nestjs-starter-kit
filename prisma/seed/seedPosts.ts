import { PrismaClient } from '@prisma/client';
import { postData } from './data/posts';

export async function seedPosts(prisma: PrismaClient): Promise<void> {
  if ((await prisma.post.count()) < 1) {
    await prisma.post.createMany({
      data: postData,
    });
  }
}
