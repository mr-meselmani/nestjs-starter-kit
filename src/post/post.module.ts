import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostClient } from './post.client';

@Module({
  controllers: [PostController],
  providers: [PostService, PostClient],
})
export class PostModule {}
