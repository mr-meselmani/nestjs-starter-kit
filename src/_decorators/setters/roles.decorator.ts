/* eslint-disable @typescript-eslint/naming-convention */
import { SetMetadata } from '@nestjs/common';
import { ROLES_ENUM, UserType } from '@prisma/client';

export type ALL_ROLES_ENUM = ROLES_ENUM | UserType;

// If you changed here make sure to change the (rolesHierarchy) in src/guards/roles.guard.ts
export const ALL_ROLES: Record<ALL_ROLES_ENUM, ALL_ROLES_ENUM> = {
  ...UserType,
  ...ROLES_ENUM,
};

export const ROLES_KEY = 'required-roles';
export const CustomRole = (
  requiredRoles: ALL_ROLES_ENUM[],
): ReturnType<typeof SetMetadata> => {
  return SetMetadata(ROLES_KEY, requiredRoles);
};
