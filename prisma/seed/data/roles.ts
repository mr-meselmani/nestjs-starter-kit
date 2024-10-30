import { Role, ROLES_ENUM } from '@prisma/client';

export const rolesData: Array<Pick<Role, 'name' | 'priority'>> = [
  {
    name: ROLES_ENUM.SUPER_ADMIN,
    priority: 1,
  },
  {
    name: ROLES_ENUM.ADMIN,
    priority: 2,
  },
  {
    name: ROLES_ENUM.MODERATOR,
    priority: 3,
  },
  {
    name: ROLES_ENUM.SUPPORT,
    priority: 4,
  },
];
