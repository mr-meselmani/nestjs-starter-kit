import {
  ALL_ROLES_ENUM,
  ROLES_KEY,
} from '@/_decorators/setters/roles.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const requiredRoles = this.reflector.getAllAndOverride<ALL_ROLES_ENUM[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    // Here we are getting the user from the request object
    const { user } = context.switchToHttp().getRequest();

    try {
      // Here we query the database to get the user assignedRole
      const userRole = await this.prisma.user.findUniqueOrThrow({
        where: { id: user.id },
        select: {
          type: true,
          administrator: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  priority: true,
                },
              },
            },
          },
        },
      });

      // Declare assignedRole variable to store the user's assignedRole
      let assignedRole: ALL_ROLES_ENUM;

      // Assign assignedRole
      if (userRole.administrator !== null) {
        assignedRole = userRole.administrator.role.name;
      } else {
        assignedRole = userRole.type;
      }
      request.user = {
        ...request.user,
        role: assignedRole,
        userType: userRole.type,
      };

      return requiredRoles.some((role) => assignedRole === role);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Promise.reject(
          new InternalServerErrorException(
            `RolesGuard: Something went wrong with code: ${e.code}`,
          ),
        );
      }

      return Promise.reject(
        new InternalServerErrorException(`RolesGuard: Something went wrong`),
      );
    }
  }
}
