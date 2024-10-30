import { z } from 'zod';
import { ICreateOrUpdatePostBody } from './post.model';

export const createOrUpdatePostBodySchema: z.ZodSchema<ICreateOrUpdatePostBody> =
  z.object({
    title: z.string(),
    content: z.string(),
  });
