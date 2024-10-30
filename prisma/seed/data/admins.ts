import { Administrator } from '@prisma/client';

export const adminsData: Array<Pick<Administrator, 'userId' | 'roleId'>> = [
  {
    userId: 1,
    roleId: 1,
  },
];
