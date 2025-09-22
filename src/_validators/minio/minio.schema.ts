import { z } from 'zod';

// Schema for file upload
export const uploadFileSchema = z.object({
  bucket: z.string().min(1, 'Bucket name is required'),
  fileName: z.string().min(1, 'File name is required'),
  mimeType: z.string().min(1, 'MIME type is required'),
});

// Schema for file download/presigned URL
export const fileAccessSchema = z.object({
  bucket: z
    .string()
    .min(1, 'Bucket name is required')
    .describe('The name of the bucket containing the file'),
  fileName: z
    .string()
    .min(1, 'File name is required')
    .describe('The name of the file'),
  expiry: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        return parseInt(val, 10);
      }
      return val;
    }, z.number().int().min(1).max(604800))
    .optional()
    .default(3600)
    .describe('URL expiry time in seconds (1 hour to 7 days)'),
});

// Schema for file deletion
export const deleteFileSchema = z.object({
  bucket: z
    .string()
    .min(1, 'Bucket name is required')
    .describe('The name of the bucket containing the file'),
  fileName: z
    .string()
    .min(1, 'File name is required')
    .describe('The name of the file to delete'),
});

// Schema for listing files in bucket
export const listFilesSchema = z.object({
  bucket: z
    .string()
    .min(1, 'Bucket name is required')
    .describe('The name of the bucket to list files from'),
  prefix: z
    .string()
    .optional()
    .describe(
      'Filter files by prefix (e.g., "images/" for files starting with "images/")',
    ),
  recursive: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        return val === 'true';
      }
      return val;
    }, z.boolean())
    .optional()
    .default(true)
    .describe('Whether to list files recursively in subdirectories'),
});

// Schema for bucket operations
export const bucketOperationSchema = z.object({
  bucket: z
    .string()
    .min(1, 'Bucket name is required')
    .describe('The name of the bucket to operate on'),
});

// Response schemas
export const uploadResponseSchema = z.object({
  bucket: z.string(),
  fileName: z.string(),
  etag: z.string(),
  size: z.number(),
  url: z.string().optional(),
});

export const presignedUrlResponseSchema = z.object({
  url: z.string(),
  bucket: z.string(),
  fileName: z.string(),
  expiry: z.number(),
});

export const fileListResponseSchema = z.object({
  bucket: z.string(),
  files: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      lastModified: z.string().datetime(),
      etag: z.string(),
    }),
  ),
  count: z.number(),
});

export const deleteResponseSchema = z.object({
  message: z.string(),
  bucket: z.string(),
  fileName: z.string(),
});

export const bucketResponseSchema = z.object({
  bucket: z.string(),
  created: z.boolean().optional(),
  deleted: z.boolean().optional(),
});

export const fileInfoResponseSchema = z.object({
  name: z.string(),
  size: z.number(),
  lastModified: z.string().datetime(),
  etag: z.string(),
  contentType: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});
