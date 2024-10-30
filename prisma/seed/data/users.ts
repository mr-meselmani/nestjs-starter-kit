import { User, UserStatus, UserType } from '@prisma/client';

export const userData: Array<
  Pick<User, 'firstName' | 'lastName' | 'email' | 'image' | 'type' | 'status'>
> = [
  {
    firstName: 'ASM',
    lastName: 'AUTHOR',
    email: 'dev.zap@yopmail.com',
    image: 'https://randomuser.me/api',
    type: 'AUTHOR',
    status: 'ACTIVE',
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@yopmail.com',
    image: 'https://randomuser.me/api',
    type: UserType.READER,
    status: UserStatus.ACTIVE,
  },
  {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@yopmail.com',
    image: 'https://randomuser.me/api',
    type: UserType.AUTHOR,
    status: UserStatus.ACTIVE,
  },
];
