import { Post } from '@prisma/client';

export interface ICreateOrUpdatePostBody
  extends Pick<Post, 'title' | 'content'> {}
