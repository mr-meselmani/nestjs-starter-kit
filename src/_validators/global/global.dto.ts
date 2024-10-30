import { createZodDto } from 'nestjs-zod';
import { globalIdParamSchema } from './global.schema';

export class GlobalIdParamDto extends createZodDto(globalIdParamSchema) {}
