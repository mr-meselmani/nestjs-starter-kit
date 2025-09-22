import { IApiResponse } from '../global/global.model';

// File information interface
export interface IFileInfo {
  name: string;
  size: number;
  lastModified: string; // ISO 8601 datetime string
  etag: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

// File list response interface
export interface IFileListResponse {
  bucket: string;
  files: IFileInfo[];
  count: number;
}

// Upload response interface
export interface IUploadResponse {
  bucket: string;
  fileName: string;
  etag: string;
  size: number;
  url?: string;
}

// Presigned URL response interface
export interface IPresignedUrlResponse {
  url: string;
  bucket: string;
  fileName: string;
  expiry: number;
}

// Delete response interface
export interface IDeleteResponse {
  message: string;
  bucket: string;
  fileName: string;
}

// Bucket response interface
export interface IBucketResponse {
  bucket: string;
  created?: boolean;
  deleted?: boolean;
}

// MinIO service configuration interface
export interface IMinioConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
}

// API Response types
export type IMinioUploadResponse = IApiResponse<IUploadResponse>;
export type IMinioPresignedUrlResponse = IApiResponse<IPresignedUrlResponse>;
export type IMinioFileListResponse = IApiResponse<IFileListResponse>;
export type IMinioFileInfoResponse = IApiResponse<IFileInfo>;
export type IMinioDeleteResponse = IApiResponse<IDeleteResponse>;
export type IMinioBucketResponse = IApiResponse<IBucketResponse>;
export type IMinioBucketsListResponse = IApiResponse<any[]>; // MinIO's listBuckets() returns any[]

// Upload request interface
export interface IUploadRequest {
  bucket: string;
  fileName: string;
  mimeType: string;
  file: Express.Multer.File;
}

// File access request interface
export interface IFileAccessRequest {
  bucket: string;
  fileName: string;
  expiry?: number;
}

// List files request interface
export interface IListFilesRequest {
  bucket: string;
  prefix?: string;
  recursive?: boolean;
}

// Delete file request interface
export interface IDeleteFileRequest {
  bucket: string;
  fileName: string;
}

// Bucket operation request interface
export interface IBucketOperationRequest {
  bucket: string;
}
