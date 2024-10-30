/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
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
import { zodToOpenAPI } from 'nestjs-zod';

type ParamSchema = any;
type QuerySchema = any;
type ResponseSchema = any;
type BodySchema = any;

// eslint-disable-next-line @typescript-eslint/naming-convention
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
  summary?: string;
}): MethodDecorator {
  const decorators = [];
  const multipleParams = [];

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }

  // Param Dec
  if (paramDec) {
    if (Array.isArray(paramDec.paramName) && paramDec.paramName.length > 0) {
      paramDec.paramName.forEach((param) => {
        multipleParams.push(param);
        decorators.push(
          ApiParam({
            name: param,
            schema: zodToOpenAPI(paramDec.paramSchema).properties,
          }),
        );
      });
    } else {
      decorators.push(
        ApiParam({
          name: Array.isArray(paramDec.paramName)
            ? paramDec.paramName.join(',')
            : paramDec.paramName,
          schema: zodToOpenAPI(paramDec.paramSchema).properties,
        }),
      );
    }
  }

  // Query Dec
  if (queryDec) {
    decorators.push(
      ApiQuery({
        name: 'Query',
        schema: zodToOpenAPI(queryDec.querySchema),
      }),
    );
  }

  // Api Res Dec
  if (resDec) {
    decorators.push(
      ApiResponse({
        schema: zodToOpenAPI(resDec.responseSchema),
      }),
    );
  }

  // Body Dec
  if (bodyDec) {
    decorators.push(
      ApiBody({
        description: `Payload`,
        schema: zodToOpenAPI(bodyDec.payloadSchema),
      }),
    );
  }

  // Unauth Dec
  if (unauthDec) {
    decorators.push(
      ApiUnauthorizedResponse({
        status: 401,
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
        status: 403,
        description: `Forbidden Access`,
      }),
    );
  }

  // Notfound Dec
  if (notfoundDec) {
    decorators.push(
      ApiNotFoundResponse({
        status: 404,
        description: `Not Found`,
      }),
    );
  }

  // Conflict Dec
  if (conflictDec) {
    decorators.push(
      ApiConflictResponse({
        status: 409,
        description: `Conflict`,
      }),
    );
  }

  // Badrequest Dec
  if (badrequestDec) {
    decorators.push(
      ApiBadRequestResponse({
        status: 400,
        description: `Bad Request`,
      }),
    );
  }

  // Internal Error Dec
  if (internalErrorDec) {
    decorators.push(
      ApiInternalServerErrorResponse({
        status: 500,
        description: `Internal server error.`,
      }),
    );
  }

  // Created Dec
  if (createdDec) {
    decorators.push(
      ApiCreatedResponse({
        status: 201,
        description: `Created successfully`,
      }),
    );
  }

  if (statusOK) {
    decorators.push(
      ApiOkResponse({
        status: 200,
        description: 'Success',
      }),
    );
  }

  return applyDecorators(...decorators);
}
