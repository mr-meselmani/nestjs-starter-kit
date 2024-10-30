import { User } from '@prisma/client';

export interface IGetUserByIdResponse
  extends Pick<User, 'firstName' | 'lastName' | 'email' | 'image' | 'type'> {}
