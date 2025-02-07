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
import { CreateOrUpdatePostBodyDto } from '@/_validators/post/post.dto';
import { CurrentSystemUser } from '@/_decorators/getters/currentSystemUser.decorator';
import { ICurrentSystemUser } from '@/_validators/auth/auth.model';
import { IApiResponse } from '@/_validators/global/global.model';
import { Post as post } from '@prisma/client';
import { GlobalIdParamDto } from '@/_validators/global/global.dto';
import { RolesGuard } from '@/_guards/roles.guard';
import { ALL_ROLES, CustomRole } from '@/_decorators/setters/roles.decorator';
import { POST_PATHS } from '@/_paths/post';
import { ApiTags } from '@nestjs/swagger';

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
