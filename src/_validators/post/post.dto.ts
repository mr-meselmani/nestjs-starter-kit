import { createZodDto } from 'nestjs-zod';
import { createOrUpdatePostBodySchema } from './post.schema';

export class CreateOrUpdatePostBodyDto extends createZodDto(
  createOrUpdatePostBodySchema,
) {}
