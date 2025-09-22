import { createZodDto } from 'nestjs-zod';
import {
  uploadFileSchema,
  fileAccessSchema,
  deleteFileSchema,
  listFilesSchema,
  bucketOperationSchema,
  uploadResponseSchema,
  presignedUrlResponseSchema,
  fileListResponseSchema,
  deleteResponseSchema,
  bucketResponseSchema,
  fileInfoResponseSchema,
} from './minio.schema';

// Request DTOs
export class UploadFileDto extends createZodDto(uploadFileSchema) {}
export class FileAccessDto extends createZodDto(fileAccessSchema) {}
export class DeleteFileDto extends createZodDto(deleteFileSchema) {}
export class ListFilesDto extends createZodDto(listFilesSchema) {}
export class BucketOperationDto extends createZodDto(bucketOperationSchema) {}

// Response DTOs
export class UploadResponseDto extends createZodDto(uploadResponseSchema) {}
export class PresignedUrlResponseDto extends createZodDto(
  presignedUrlResponseSchema,
) {}
export class FileListResponseDto extends createZodDto(fileListResponseSchema) {}
export class DeleteResponseDto extends createZodDto(deleteResponseSchema) {}
export class BucketResponseDto extends createZodDto(bucketResponseSchema) {}
export class FileInfoResponseDto extends createZodDto(fileInfoResponseSchema) {}
