import { pbkdf2Sync, randomBytes } from 'crypto';

export class HashService {
  static generateHash(password: string): { hash: string; salt: string } {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  static compareHash({
    tobeHashed,
    storedHash,
    storedSalt,
  }: {
    tobeHashed: string;
    storedHash: string;
    storedSalt: string;
  }): boolean {
    const inputHash = pbkdf2Sync(
      tobeHashed,
      storedSalt,
      1000,
      64,
      'sha512',
    ).toString('hex');
    const passwordsMatch = storedHash === inputHash;
    return passwordsMatch;
  }
}
