import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserClient } from './user.client';
import { PasswordService } from 'src/password/password.service';
import { User } from '@prisma/client';
import { IGetUserByIdResponse } from 'src/_validators/user/user.model';

@Injectable()
export class UserService {
  constructor(
    private readonly userClient: UserClient,
    private readonly passwordService: PasswordService,
  ) {}

  // Create user or throw
  public async createUserOrThrow({
    firstName,
    lastName,
    email,
    password: plainTextPassword,
  }: Pick<User, 'firstName' | 'lastName' | 'email'> & {
    password: string;
  }): Promise<User> {
    await this.checkIfUserExistsByEmail(email);

    const createdUser = await this.userClient.createUserOrThrow({
      firstName,
      lastName,
      email,
    });

    await this.passwordService.hashThenCreateOrUpdatePassword({
      userId: createdUser.id,
      plainTextPassword,
    });

    return createdUser;
  }

  // Check if user exists by email
  public async checkIfUserExistsByEmail(email: User['email']): Promise<void> {
    const userExist = await this.userClient.checkIfUserExistsByEmail(email);

    if (userExist) {
      return Promise.reject(
        new ConflictException(
          `UserService: user with email ${email} already exist`,
        ),
      );
    }
  }

  // Get user by email or null
  public async getUserByEmailOrNull(
    email: User['email'],
  ): Promise<User | null> {
    return this.userClient.getUserByEmailOrNull(email);
  }

  // Update user status to active
  public async updateUserStatusToActive(userId: User['id']): Promise<void> {
    return this.userClient.updateUserStatusToActiveOrThrow(userId);
  }

  // Get user by id or null
  public async getUserByIdOrNull(userId: number): Promise<User | null> {
    return this.userClient.getUserByIdOrNull(userId);
  }

  // Check if change email is not allowed or throw
  public async checkIfChangeEmailIsNotAllowedOrThrow({
    id,
    email,
  }: Pick<User, 'id' | 'email'>): Promise<void> {
    // check if  if email is taken
    const isNotAllowed = await this.userClient.checkIfChangeEmailIsNotAllowed({
      id,
      email,
    });

    if (isNotAllowed) {
      return Promise.reject(
        new ForbiddenException(
          `UserService: checkIfChangeEmailIsNotAllowedOrThrow : email already used`,
        ),
      );
    }
  }

  // Change email
  public async changeEmail(
    userId: number,
    {
      newEmail,
      email,
      status,
    }: Partial<Pick<User, 'email' | 'newEmail' | 'status'>>,
  ): Promise<User> {
    const result = await this.userClient.changeEmailOrThrow(userId, {
      email,
      newEmail,
      status,
    });
    return result;
  }

  // Get all users
  public async getAllUsers(): Promise<User[]> {
    return this.userClient.getAllUsers();
  }

  // Get user by id
  public async getUserById(
    id: User['id'],
  ): Promise<IGetUserByIdResponse | null> {
    return this.userClient.getUserById(id);
  }
}
