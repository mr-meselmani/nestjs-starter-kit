import { z } from 'zod';
import { IGetUserByIdResponse } from './user.model';
import { UserType } from '@prisma/client';

export const getUserByIdResponseSchema: z.ZodSchema<IGetUserByIdResponse> =
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    image: z.string(),
    type: z.nativeEnum(UserType),
  });
