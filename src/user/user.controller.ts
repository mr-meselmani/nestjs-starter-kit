import { USER_PATHS } from '@/_paths/user';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { IApiResponse } from '@/_validators/global/global.model';
import { ApiTags } from '@nestjs/swagger';
import { CustomSwaggerDecorator } from '@/_decorators/setters/swagger.decorator';
import { GlobalIdParamDto } from '@/_validators/global/global.dto';
import { IGetUserByIdResponse } from '@/_validators/user/user.model';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetUserByIdResponseDto } from '@/_validators/user/user.dto';
import { ALL_ROLES, CustomRole } from '@/_decorators/setters/roles.decorator';
import { RolesGuard } from '@/_guards/roles.guard';

@ApiTags(USER_PATHS.PATH_PREFIX)
@UseGuards(RolesGuard)
@Controller(USER_PATHS.PATH_PREFIX)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users
  @CustomSwaggerDecorator({
    authDec: true,
    unauthDec: true,
    statusOK: true,
  })
  @Get()
  @CustomRole([ALL_ROLES.SUPER_ADMIN])
  public async getAllUsers(): Promise<IApiResponse<User[]>> {
    return {
      message: 'success',
      data: await this.userService.getAllUsers(),
    };
  }

  // Get user by id
  @CustomSwaggerDecorator({
    paramDec: {
      paramName: 'id',
      paramSchema: GlobalIdParamDto.schema,
    },
    resDec: {
      responseSchema: GetUserByIdResponseDto.schema,
    },
    authDec: true,
    unauthDec: true,
    statusOK: true,
  })
  @Get(USER_PATHS.GET_USER_BY_ID)
  @ZodSerializerDto(GetUserByIdResponseDto)
  public async getUserById(
    @Param() { id }: GlobalIdParamDto,
  ): Promise<IApiResponse<IGetUserByIdResponse | null>> {
    return {
      message: 'success',
      data: await this.userService.getUserById(id),
    };
  }
}
