import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { ApplicationError } from '../errors/application-error';

type ErrorMessage = string | string[];

const RETRYABLE_HTTP_STATUSES = new Set<number>([
  HttpStatus.REQUEST_TIMEOUT,
  HttpStatus.TOO_MANY_REQUESTS,
  HttpStatus.BAD_GATEWAY,
  HttpStatus.SERVICE_UNAVAILABLE,
  HttpStatus.GATEWAY_TIMEOUT,
]);

const SAFE_REQUEST_ID = /^[A-Za-z0-9._:-]{1,128}$/;

interface StableErrorResponse {
  statusCode: number;
  code: string;
  message: ErrorMessage;
  retryable: boolean;
  requestId: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const request = context.getRequest();
    const requestId = this.getRequestId(request);
    const body = this.toResponse(exception, requestId);
    const response = context.getResponse();

    httpAdapter.setHeader(response, 'x-request-id', requestId);

    if (
      (exception instanceof HttpException || exception instanceof ApplicationError) &&
      body.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      this.logger.error(
        `HTTP exception [${requestId}] (${body.statusCode}): ${this.getLogMessage(exception)}`,
        exception.stack,
      );
    } else if (!(exception instanceof HttpException) && !(exception instanceof ApplicationError)) {
      const error = exception instanceof Error ? exception : undefined;
      this.logger.error(
        `Unhandled exception [${requestId}]: ${error?.message ?? String(exception)}`,
        error?.stack,
      );
    }

    httpAdapter.reply(context.getResponse(), body, body.statusCode);
  }

  private toResponse(exception: unknown, requestId: string): StableErrorResponse {
    if (exception instanceof ApplicationError) {
      return {
        statusCode: exception.statusCode,
        code: exception.code,
        message:
          exception.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
            ? '服务器内部错误'
            : exception.message,
        retryable: exception.retryable,
        requestId,
      };
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        return {
          statusCode,
          code: 'INTERNAL_ERROR',
          message: '服务器内部错误',
          retryable: RETRYABLE_HTTP_STATUSES.has(statusCode),
          requestId,
        };
      }
      const response = exception.getResponse();
      const message = this.getHttpMessage(response, exception.message);

      return {
        statusCode,
        code: this.getHttpCode(statusCode, message),
        message,
        retryable: RETRYABLE_HTTP_STATUSES.has(statusCode),
        requestId,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误',
      retryable: false,
      requestId,
    };
  }

  private getHttpMessage(response: string | object, fallback: string): ErrorMessage {
    if (typeof response === 'string') return response;
    const message = (response as { message?: unknown }).message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
      return message;
    }
    return fallback;
  }

  private getHttpCode(statusCode: number, message: ErrorMessage): string {
    if (statusCode === HttpStatus.BAD_REQUEST && Array.isArray(message)) {
      return 'VALIDATION_ERROR';
    }

    return HttpStatus[statusCode] ?? 'HTTP_ERROR';
  }

  private getLogMessage(exception: HttpException | ApplicationError): string {
    if (exception instanceof ApplicationError) return exception.message;
    const response = exception.getResponse();
    const message = this.getHttpMessage(response, exception.message);
    return Array.isArray(message) ? message.join('; ') : message;
  }

  private getRequestId(request: {
    get?: (name: string) => string | undefined;
    headers?: Record<string, string | string[] | undefined>;
  }): string {
    const value = request.get?.('x-request-id') ?? request.headers?.['x-request-id'];
    const requestId = Array.isArray(value) ? value[0] : value;
    return requestId && SAFE_REQUEST_ID.test(requestId) ? requestId : randomUUID();
  }
}
