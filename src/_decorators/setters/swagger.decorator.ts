/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { z } from 'zod';

type ParamSchema = z.ZodSchema<any>;
type QuerySchema = z.ZodSchema<any>;
type ResponseSchema = z.ZodSchema<any>;
type BodySchema = z.ZodSchema<any>;

export function CustomSwaggerDecorator({
  summary,
  paramDec,
  queryDec,
  resDec,
  bodyDec,
  unauthDec,
  authDec,
  forbiddenDec,
  notfoundDec,
  conflictDec,
  badrequestDec,
  internalErrorDec,
  createdDec,
  statusOK,
  fileUpload,
}: {
  paramDec?: {
    paramName: string[] | string;
    paramSchema?: ParamSchema;
  };
  queryDec?: {
    querySchema?: QuerySchema;
  };
  resDec?: {
    responseSchema?: ResponseSchema;
  };
  bodyDec?: {
    payloadSchema?: BodySchema;
  };
  unauthDec?: boolean;
  authDec?: boolean;
  forbiddenDec?: boolean;
  notfoundDec?: boolean;
  conflictDec?: boolean;
  badrequestDec?: boolean;
  internalErrorDec?: boolean;
  createdDec?: boolean;
  statusOK?: boolean;
  fileUpload?: {
    fieldName: string;
    description: string;
    required: boolean;
  };
  summary?: string;
}): MethodDecorator {
  const decorators: any[] = [];
  const multipleParams: string[] = [];

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }

  // Param Dec
  if (paramDec && paramDec.paramSchema) {
    if (Array.isArray(paramDec.paramName) && paramDec.paramName.length > 0) {
      paramDec.paramName.forEach((param) => {
        multipleParams.push(param);
        decorators.push(
          ApiParam({
            name: param,
            schema: z.toJSONSchema(paramDec.paramSchema!) as any,
          }),
        );
      });
    } else {
      decorators.push(
        ApiParam({
          name: Array.isArray(paramDec.paramName)
            ? paramDec.paramName.join(',')
            : paramDec.paramName,
          schema: z.toJSONSchema(paramDec.paramSchema) as any,
        }),
      );
    }
  }

  // Query Dec
  if (queryDec && queryDec.querySchema) {
    const schema = z.toJSONSchema(queryDec.querySchema) as any;
    if (schema.properties) {
      Object.keys(schema.properties).forEach((key) => {
        decorators.push(
          ApiQuery({
            name: key,
            required: schema.required?.includes(key) || false,
            schema: schema.properties[key],
            description:
              schema.properties[key].description || `${key} parameter`,
          }),
        );
      });
    } else {
      decorators.push(
        ApiQuery({
          name: 'Query',
          schema: schema,
        }),
      );
    }
  }

  // Api Res Dec
  if (resDec && resDec.responseSchema) {
    decorators.push(
      ApiResponse({
        schema: z.toJSONSchema(resDec.responseSchema) as any,
      }),
    );
  }

  // Body Dec
  if (bodyDec && bodyDec.payloadSchema) {
    decorators.push(
      ApiBody({
        description: `Payload`,
        schema: z.toJSONSchema(bodyDec.payloadSchema) as any,
      }),
    );
  }

  // File Upload Dec
  if (fileUpload) {
    decorators.push(
      ApiConsumes('multipart/form-data'),
      ApiBody({
        description: fileUpload.description,
        schema: {
          type: 'object',
          properties: {
            [fileUpload.fieldName]: {
              type: 'string',
              format: 'binary',
            },
            bucket: {
              type: 'string',
              example: 'my-bucket',
            },
            fileName: {
              type: 'string',
              example: 'my-file.jpg',
            },
            mimeType: {
              type: 'string',
              example: 'image/jpeg',
            },
          },
          required: fileUpload.required
            ? [fileUpload.fieldName, 'bucket', 'fileName', 'mimeType']
            : ['bucket', 'fileName', 'mimeType'],
        },
      }),
    );
  }

  // Unauth Dec
  if (unauthDec) {
    decorators.push(
      ApiUnauthorizedResponse({
        description: `Unauthorized Access`,
      }),
    );
  }

  // Auth Dec
  if (authDec) {
    decorators.push(ApiBearerAuth());
  }

  // Forbidden Dec
  if (forbiddenDec) {
    decorators.push(
      ApiForbiddenResponse({
        description: `Forbidden Access`,
      }),
    );
  }

  // Notfound Dec
  if (notfoundDec) {
    decorators.push(
      ApiNotFoundResponse({
        description: `Not Found`,
      }),
    );
  }

  // Conflict Dec
  if (conflictDec) {
    decorators.push(
      ApiConflictResponse({
        description: `Conflict`,
      }),
    );
  }

  // Badrequest Dec
  if (badrequestDec) {
    decorators.push(
      ApiBadRequestResponse({
        description: `Bad Request`,
      }),
    );
  }

  // Internal Error Dec
  if (internalErrorDec) {
    decorators.push(
      ApiInternalServerErrorResponse({
        description: `Internal server error.`,
      }),
    );
  }

  // Created Dec
  if (createdDec) {
    decorators.push(
      ApiCreatedResponse({
        description: `Created successfully`,
      }),
    );
  }

  if (statusOK) {
    decorators.push(
      ApiOkResponse({
        description: 'Success',
      }),
    );
  }

  return applyDecorators(...decorators);
}
