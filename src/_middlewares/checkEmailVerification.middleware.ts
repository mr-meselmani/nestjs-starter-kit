import { IVerifyEmailBody } from 'src/_validators/auth/auth.model';
import { sendVerifyEmailBodySchema } from 'src/_validators/auth/auth.schema';
import { UserService } from 'src/user/user.service';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckEmailVerificationMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const requestBody: IVerifyEmailBody = req.body;

    const schemaResult = sendVerifyEmailBodySchema.safeParse(requestBody);

    if (!schemaResult.success)
      res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: schemaResult.error.flatten(),
      });

    const user = await this.userService.getUserByEmailOrNull(requestBody.email);

    if (!user) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: `User not found`,
      });
    } else {
      if (user.status === UserStatus.ACTIVE) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: `User already verified`,
        });
      }
    }
    next();
  }
}
