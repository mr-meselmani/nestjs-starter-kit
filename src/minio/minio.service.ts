import {
  Injectable,
  OnModuleInit,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import {
  IUploadResponse,
  IPresignedUrlResponse,
  IFileListResponse,
  IFileInfo,
  IDeleteResponse,
  IBucketResponse,
} from '../_validators/minio/minio.model';
import { CONFIG_NAME_SPACED } from '../_config/types';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Client;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const config = this.configService.get(CONFIG_NAME_SPACED.MINIO);

    this.minioClient = new Client(config);
  }

  get client(): Client {
    return this.minioClient;
  }

  async ensureBucket(bucket: string) {
    const exists = await this.minioClient.bucketExists(bucket);
    if (!exists) {
      await this.minioClient.makeBucket(bucket, 'us-east-1');
    }
  }

  async uploadFile(
    bucket: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<IUploadResponse> {
    try {
      await this.ensureBucket(bucket);

      const result = await this.minioClient.putObject(
        bucket,
        fileName,
        buffer,
        buffer.length,
        {
          'Content-Type': mimeType,
        },
      );

      // Generate presigned URL for immediate access
      const url = await this.minioClient.presignedGetObject(
        bucket,
        fileName,
        3600,
      );

      return {
        bucket,
        fileName,
        etag: result.etag,
        size: buffer.length,
        url,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  async getPresignedUrl(
    bucket: string,
    fileName: string,
    expiry = 60 * 60,
  ): Promise<IPresignedUrlResponse> {
    try {
      // Check if file exists
      const exists = await this.fileExists(bucket, fileName);
      if (!exists) {
        throw new NotFoundException('File not found');
      }

      const url = await this.minioClient.presignedGetObject(
        bucket,
        fileName,
        expiry,
      );

      return {
        url,
        bucket,
        fileName,
        expiry,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to generate presigned URL: ${error.message}`,
      );
    }
  }

  async deleteFile(bucket: string, fileName: string): Promise<IDeleteResponse> {
    try {
      // Check if file exists
      const exists = await this.fileExists(bucket, fileName);
      if (!exists) {
        throw new NotFoundException('File not found');
      }

      await this.minioClient.removeObject(bucket, fileName);

      return {
        message: 'File deleted successfully',
        bucket,
        fileName,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  async listFiles(
    bucket: string,
    prefix?: string,
    recursive = true,
  ): Promise<IFileListResponse> {
    try {
      const files: IFileInfo[] = [];
      const stream = this.minioClient.listObjects(bucket, prefix, recursive);

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          files.push({
            name: obj.name || '',
            size: obj.size || 0,
            lastModified: (obj.lastModified || new Date()).toISOString(),
            etag: obj.etag || '',
          });
        });

        stream.on('end', () => {
          resolve({
            bucket,
            files,
            count: files.length,
          });
        });

        stream.on('error', (error) => {
          reject(
            new BadRequestException(`Failed to list files: ${error.message}`),
          );
        });
      });
    } catch (error) {
      throw new BadRequestException(`Failed to list files: ${error.message}`);
    }
  }

  async fileExists(bucket: string, fileName: string) {
    try {
      await this.minioClient.statObject(bucket, fileName);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getFileInfo(bucket: string, fileName: string): Promise<IFileInfo> {
    try {
      const stat = await this.minioClient.statObject(bucket, fileName);

      return {
        name: fileName,
        size: stat.size,
        lastModified: stat.lastModified.toISOString(),
        etag: stat.etag,
        contentType: stat.metaData['content-type'],
        metadata: stat.metaData,
      };
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  async createBucket(bucket: string): Promise<IBucketResponse> {
    try {
      const exists = await this.minioClient.bucketExists(bucket);
      if (!exists) {
        await this.minioClient.makeBucket(bucket, 'us-east-1');
        return { bucket, created: true };
      }
      return { bucket, created: false };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create bucket: ${error.message}`,
      );
    }
  }

  async deleteBucket(bucket: string): Promise<IBucketResponse> {
    try {
      const exists = await this.minioClient.bucketExists(bucket);
      if (exists) {
        await this.minioClient.removeBucket(bucket);
        return { bucket, deleted: true };
      }
      throw new NotFoundException('Bucket not found');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete bucket: ${error.message}`,
      );
    }
  }

  async listBuckets(): Promise<any[]> {
    try {
      return await this.minioClient.listBuckets();
    } catch (error) {
      throw new BadRequestException(`Failed to list buckets: ${error.message}`);
    }
  }
}
