import { z } from 'zod';

// This is used to validate standard responses for all endpoints.
export function generalResponse<T>(schema: z.ZodSchema<T>): z.ZodObject<{
  message: z.ZodString;
  data: z.ZodSchema<T>;
}> {
  return z.object({
    message: z.string(),
    data: schema,
  });
}

// This is used to validate id params in endpoints.
export const globalIdParamSchema = z.object({
  id: z.preprocess((val) => {
    if (typeof val === 'string') return parseInt(val);
    return val;
  }, z.number().int()),
});
