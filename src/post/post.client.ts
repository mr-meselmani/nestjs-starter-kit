import { ICreateOrUpdatePostBody } from '@/_validators/post/post.model';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';

@Injectable()
export class PostClient {
  constructor(private readonly prisma: PrismaService) {}

  // Create post
  public async createPost({
    userId,
    postPayload,
  }: {
    userId: User['id'];
    postPayload: ICreateOrUpdatePostBody;
  }): Promise<Post> {
    try {
      const post = await this.prisma.post.create({
        data: {
          userId,
          title: postPayload.title,
          content: postPayload.content,
        },
      });

      return post;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Promise.reject(
          new InternalServerErrorException(
            `PostClient: error creating a post with code: ${e.code}`,
          ),
        );
      }

      return Promise.reject(
        new InternalServerErrorException(
          `PostClient: something went wrong while creating post`,
        ),
      );
    }
  }

  // Get all posts
  public async getAllPosts(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }

  // Get all posts for a user
  public async getAllPostsForAUser(userId: User['id']): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        userId,
      },
    });
  }

  // Get post by id
  public async getPostById(id: Post['id']): Promise<Post | null> {
    try {
      return this.prisma.post.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Promise.reject(
          new InternalServerErrorException(
            `PostClient: error finding post with id: ${id} with code: ${e.code}`,
          ),
        );
      }

      return Promise.reject(
        new InternalServerErrorException(
          `PostClient: something went wrong while getting post with id: ${id}`,
        ),
      );
    }
  }

  // Update post
  public async updatePost({
    userId,
    postId,
    postPayload,
  }: {
    userId: User['id'];
    postId: Post['id'];
    postPayload: ICreateOrUpdatePostBody;
  }): Promise<Post> {
    try {
      return this.prisma.post.update({
        where: {
          userId,
          id: postId,
        },
        data: {
          title: postPayload.title,
          content: postPayload.content,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Promise.reject(
          new InternalServerErrorException(
            `PostClient: error while udpating post with id: ${postId} with code: ${e.code}`,
          ),
        );
      }

      return Promise.reject(
        new InternalServerErrorException(
          `PostClient: something went wrong while updating post with id: ${postId}`,
        ),
      );
    }
  }

  // Remove post
  public async removePost({
    userId,
    postId,
  }: {
    userId: User['id'];
    postId: Post['id'];
  }): Promise<Post> {
    return this.prisma.post.delete({
      where: {
        userId,
        id: postId,
      },
    });
  }
}
