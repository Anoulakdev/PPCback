import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter
  extends BaseExceptionFilter
  implements GqlExceptionFilter
{
  private readonly logger: Logger = new Logger();

  catch(exception: HttpException, host: ArgumentsHost) {
    // let args: unknown;
    if (host.getType<GqlContextType>() === `graphql`) {
      return exception;
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res = exception.getResponse();

    return response.status(status).json({
      status: status,
      errors: res,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
