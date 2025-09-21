import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreateOrUpdatePostBodyDto } from 'src/_validators/post/post.dto';
import { CurrentSystemUser } from 'src/_decorators/getters/currentSystemUser.decorator';
import type { ICurrentSystemUser } from 'src/_validators/auth/auth.model';
import { IApiResponse } from 'src/_validators/global/global.model';
import { Post as post } from '@prisma/client';
import { GlobalIdParamDto } from 'src/_validators/global/global.dto';
import { RolesGuard } from 'src/_guards/roles.guard';
import { POST_PATHS } from 'src/_paths/post';
import { ApiTags } from '@nestjs/swagger';
import { PublicEndpoint } from 'src/_decorators/setters/publicEndpoint.decorator';
import { CustomSwaggerDecorator } from 'src/_decorators/setters/swagger.decorator';

@ApiTags(POST_PATHS.PATH_PREFIX)
@UseGuards(RolesGuard)
@Controller(POST_PATHS.PATH_PREFIX)
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Create post
  @Post()
  public async createPost(
    @CurrentSystemUser() { id }: ICurrentSystemUser,
    @Body() postPayload: CreateOrUpdatePostBodyDto,
  ): Promise<IApiResponse<post>> {
    return {
      message: 'success',
      data: await this.postService.createPost({
        userId: id,
        postPayload,
      }),
    };
  }

  // Get all posts
  @CustomSwaggerDecorator({
    summary: 'Get all posts',
    statusOK: true,
  })
  @PublicEndpoint()
  @Get()
  public async getAllPosts(): Promise<IApiResponse<post[]>> {
    return {
      message: 'success',
      data: await this.postService.getAllPosts(),
    };
  }

  // Get all posts for a user
  @Get(POST_PATHS.GET_ALL_POSTS_BY_USER)
  public async getAllPostsForAUser(
    @CurrentSystemUser() { id: userId }: ICurrentSystemUser,
  ): Promise<IApiResponse<post[]>> {
    return {
      message: 'success',
      data: await this.postService.getAllPostsForAUser(userId),
    };
  }

  // Get post by id
  @Get(':id')
  public async getPostById(
    @Param() { id }: GlobalIdParamDto,
  ): Promise<IApiResponse<post | null>> {
    return {
      message: 'success',
      data: await this.postService.getPostById(id),
    };
  }

  // Update post
  @Put(':id')
  public async updatePost(
    @CurrentSystemUser() { id: userId }: ICurrentSystemUser,
    @Param() { id }: GlobalIdParamDto,
    @Body() postPayload: CreateOrUpdatePostBodyDto,
  ): Promise<IApiResponse<post>> {
    return {
      message: 'success',
      data: await this.postService.updatePost({
        userId,
        postId: id,
        postPayload,
      }),
    };
  }

  // Remove post
  @Delete(':id')
  public async removePost(
    @CurrentSystemUser() { id: userId }: ICurrentSystemUser,
    @Param() { id }: GlobalIdParamDto,
  ): Promise<IApiResponse<post>> {
    return {
      message: 'success',
      data: await this.postService.removePost({
        postId: id,
        userId,
      }),
    };
  }
}
