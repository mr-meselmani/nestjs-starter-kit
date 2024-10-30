import { ICreateOrUpdatePostBody } from '@/_validators/post/post.model';
import { Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PostClient } from './post.client';

@Injectable()
export class PostService {
  constructor(private readonly postClient: PostClient) {}

  // Create post
  public async createPost({
    userId,
    postPayload,
  }: {
    userId: User['id'];
    postPayload: ICreateOrUpdatePostBody;
  }): Promise<Post> {
    return this.postClient.createPost({
      userId,
      postPayload,
    });
  }

  // Get all posts
  public async getAllPosts(): Promise<Post[]> {
    return this.postClient.getAllPosts();
  }

  // Get all posts for a user
  public async getAllPostsForAUser(userId: User['id']): Promise<Post[]> {
    return this.postClient.getAllPostsForAUser(userId);
  }

  // Get post by id
  public async getPostById(id: Post['id']): Promise<Post | null> {
    return this.postClient.getPostById(id);
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
    return this.postClient.updatePost({
      userId,
      postId,
      postPayload,
    });
  }

  // Remove post
  public async removePost({
    userId,
    postId,
  }: {
    userId: User['id'];
    postId: Post['id'];
  }): Promise<Post> {
    return this.postClient.removePost({
      userId,
      postId,
    });
  }
}
