import { z } from 'zod';
import { globalIdParamSchema } from './global.schema';

// This is used as a standard response type for all endpoints.
export interface IApiResponse<T = undefined> {
  message: string;
  data?: T;
}

// This is used for id params in endpoints.
export type IGlobalIdParam = z.infer<typeof globalIdParamSchema>;
