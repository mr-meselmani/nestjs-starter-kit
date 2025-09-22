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
export const globalIdParamSchema = z
  .object({
    id: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          // Handle comma-separated values by taking the last part
          const cleanVal = val.split(',').pop()?.trim() || val;
          const parsed = parseInt(cleanVal, 10);
          if (isNaN(parsed)) {
            // Return NaN to trigger Zod's invalid_type error
            return NaN;
          }
          return parsed;
        }
        if (typeof val === 'number') {
          return val;
        }
        // If not string or number, return NaN to trigger error
        return NaN;
      },
      z
        .number()
        .int()
        .refine(
          (val) => {
            const isValid = !isNaN(val);
            return isValid;
          },
          {
            message: 'Invalid input: expected number, received NaN',
          },
        ),
    ),
  })
  .strip();
