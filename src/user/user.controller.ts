import { USER_PATHS } from 'src/_paths/user';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { IApiResponse } from 'src/_validators/global/global.model';
import { ApiTags } from '@nestjs/swagger';
import { CustomSwaggerDecorator } from 'src/_decorators/setters/swagger.decorator';
import { GlobalIdParamDto } from 'src/_validators/global/global.dto';
import { IGetUserByIdResponse } from 'src/_validators/user/user.model';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetUserByIdResponseDto } from 'src/_validators/user/user.dto';
import { ALL_ROLES, CustomRole } from 'src/_decorators/setters/roles.decorator';
import { RolesGuard } from 'src/_guards/roles.guard';
import { PublicEndpoint } from 'src/_decorators/setters/publicEndpoint.decorator';

@ApiTags(USER_PATHS.PATH_PREFIX)
@UseGuards(RolesGuard)
@Controller(USER_PATHS.PATH_PREFIX)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get all users
  @CustomSwaggerDecorator({
    summary: 'Get all users',
    statusOK: true,
  })
  @PublicEndpoint()
  @Get()
  // @CustomRole([ALL_ROLES.SUPER_ADMIN])
  public async getAllUsers(): Promise<IApiResponse<User[]>> {
    return {
      message: 'success',
      data: await this.userService.getAllUsers(),
    };
  }

  // Get user by id
  @CustomSwaggerDecorator({
    summary: 'Get user by id',
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
    console.log('getUserById', id);
    console.log(`typeof id`, typeof id);

    return {
      message: 'success',
      data: await this.userService.getUserById(id),
    };
  }
}
