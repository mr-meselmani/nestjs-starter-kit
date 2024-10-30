import { createZodDto } from 'nestjs-zod';
import { getUserByIdResponseSchema } from './user.schema';

export class GetUserByIdResponseDto extends createZodDto(
  getUserByIdResponseSchema,
) {}
