import { pbkdf2Sync, randomBytes } from 'crypto';
import { userData } from './users';
import { Password } from '@prisma/client';

export function hashAndSalt(password: string): {
  hash: string;
  salt: string;
} {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

const { hash, salt } = hashAndSalt('testPassword');

export const passwordsData = userData.map<
  Pick<Password, 'userId' | 'hash' | 'salt'>
>((user, index) => {
  return {
    userId: index + 1,
    hash,
    salt,
  };
});
