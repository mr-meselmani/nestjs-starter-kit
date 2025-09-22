import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { MinioService } from './minio.service';
import {
  UploadFileDto,
  FileAccessDto,
  DeleteFileDto,
  ListFilesDto,
  BucketOperationDto,
} from '../_validators/minio/minio.dto';
import {
  uploadResponseSchema,
  presignedUrlResponseSchema,
  fileListResponseSchema,
  deleteResponseSchema,
  fileInfoResponseSchema,
  bucketResponseSchema,
  fileAccessSchema,
  listFilesSchema,
  deleteFileSchema,
  bucketOperationSchema,
} from '../_validators/minio/minio.schema';
import { CustomSwaggerDecorator } from '../_decorators/setters/swagger.decorator';
import {
  IMinioUploadResponse,
  IMinioPresignedUrlResponse,
  IMinioFileListResponse,
  IMinioFileInfoResponse,
  IMinioDeleteResponse,
  IMinioBucketResponse,
  IMinioBucketsListResponse,
} from '../_validators/minio/minio.model';
import { PublicEndpoint } from 'src/_decorators/setters/publicEndpoint.decorator';
import { MINIO_PATHS } from 'src/_paths/minio';

@ApiTags('MinIO File Storage')
@Controller(MINIO_PATHS.PATH_PREFIX)
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post(MINIO_PATHS.UPLOAD)
  @UseInterceptors(FileInterceptor('file'))
  @CustomSwaggerDecorator({
    summary: 'Upload a file to MinIO',
    fileUpload: {
      fieldName: 'file',
      description: 'File upload with metadata',
      required: true,
    },
    resDec: {
      responseSchema: uploadResponseSchema,
    },
    createdDec: true,
    badrequestDec: true,
  })
  @PublicEndpoint()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileDto,
  ): Promise<IMinioUploadResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const { bucket, fileName, mimeType } = uploadDto;
    const result = await this.minioService.uploadFile(
      bucket,
      fileName,
      file.buffer,
      mimeType,
    );

    return {
      message: 'File uploaded successfully',
      data: result,
    };
  }

  @PublicEndpoint()
  @Get(MINIO_PATHS.GET_PRESIGNED_URL)
  @CustomSwaggerDecorator({
    summary: 'Generate a presigned URL for file access',
    queryDec: {
      querySchema: fileAccessSchema,
    },
    resDec: {
      responseSchema: presignedUrlResponseSchema,
    },
    statusOK: true,
    badrequestDec: true,
    notfoundDec: true,
  })
  async getPresignedUrl(
    @Query() fileAccessDto: FileAccessDto,
  ): Promise<IMinioPresignedUrlResponse> {
    const { bucket, fileName, expiry } = fileAccessDto;
    const result = await this.minioService.getPresignedUrl(
      bucket,
      fileName,
      expiry,
    );

    return {
      message: 'Presigned URL generated successfully',
      data: result,
    };
  }

  @PublicEndpoint()
  @Get(MINIO_PATHS.GET_FILES)
  @CustomSwaggerDecorator({
    summary: 'List files in a bucket',
    queryDec: {
      querySchema: listFilesSchema,
    },
    resDec: {
      responseSchema: fileListResponseSchema,
    },
    statusOK: true,
    badrequestDec: true,
  })
  async listFiles(
    @Query() listFilesDto: ListFilesDto,
  ): Promise<IMinioFileListResponse> {
    const { bucket, prefix, recursive } = listFilesDto;
    const result = await this.minioService.listFiles(bucket, prefix, recursive);

    return {
      message: 'Files listed successfully',
      data: result,
    };
  }

  @PublicEndpoint()
  @Get(MINIO_PATHS.GET_FILE_INFO)
  @CustomSwaggerDecorator({
    summary: 'Get file information',
    queryDec: {
      querySchema: fileAccessSchema,
    },
    resDec: {
      responseSchema: fileInfoResponseSchema,
    },
    statusOK: true,
    notfoundDec: true,
  })
  async getFileInfo(
    @Query() fileAccessDto: FileAccessDto,
  ): Promise<IMinioFileInfoResponse> {
    const { bucket, fileName } = fileAccessDto;
    const result = await this.minioService.getFileInfo(bucket, fileName);

    return {
      message: 'File information retrieved successfully',
      data: result,
    };
  }

  @PublicEndpoint()
  @Delete(MINIO_PATHS.DELETE_FILE)
  @HttpCode(HttpStatus.OK)
  @CustomSwaggerDecorator({
    summary: 'Delete a file from MinIO',
    queryDec: {
      querySchema: deleteFileSchema,
    },
    resDec: {
      responseSchema: deleteResponseSchema,
    },
    statusOK: true,
    badrequestDec: true,
    notfoundDec: true,
  })
  async deleteFile(
    @Query() deleteFileDto: DeleteFileDto,
  ): Promise<IMinioDeleteResponse> {
    const { bucket, fileName } = deleteFileDto;
    const result = await this.minioService.deleteFile(bucket, fileName);

    return {
      message: 'File deleted successfully',
      data: result,
    };
  }

  @PublicEndpoint()
  @Post(MINIO_PATHS.CREATE_BUCKET)
  @CustomSwaggerDecorator({
    summary: 'Create a new bucket',
    bodyDec: {
      payloadSchema: bucketOperationSchema,
    },
    resDec: {
      responseSchema: bucketResponseSchema,
    },
    createdDec: true,
    badrequestDec: true,
  })
  async createBucket(
    @Body() bucketDto: BucketOperationDto,
  ): Promise<IMinioBucketResponse> {
    const { bucket } = bucketDto;
    const result = await this.minioService.createBucket(bucket);

    return {
      message: result.created
        ? 'Bucket created successfully'
        : 'Bucket already exists',
      data: result,
    };
  }

  @PublicEndpoint()
  @Delete(MINIO_PATHS.DELETE_BUCKET)
  @HttpCode(HttpStatus.OK)
  @CustomSwaggerDecorator({
    summary: 'Delete a bucket',
    queryDec: {
      querySchema: bucketOperationSchema,
    },
    resDec: {
      responseSchema: bucketResponseSchema,
    },
    statusOK: true,
    badrequestDec: true,
    notfoundDec: true,
  })
  async deleteBucket(
    @Query() bucketDto: BucketOperationDto,
  ): Promise<IMinioBucketResponse> {
    const { bucket } = bucketDto;
    const result = await this.minioService.deleteBucket(bucket);

    return {
      message: 'Bucket deleted successfully',
      data: result,
    };
  }

  @PublicEndpoint()
  @Get(MINIO_PATHS.GET_BUCKETS)
  @CustomSwaggerDecorator({
    summary: 'List all buckets',
    statusOK: true,
    badrequestDec: true,
  })
  async listBuckets(): Promise<IMinioBucketsListResponse> {
    const result = await this.minioService.listBuckets();

    return {
      message: 'Buckets listed successfully',
      data: result,
    };
  }
}
