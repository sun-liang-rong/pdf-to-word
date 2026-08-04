import {
  BadRequestException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApplicationError } from '../errors/application-error';
import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  const reply = jest.fn();
  const setHeader = jest.fn();
  const adapterHost = {
    httpAdapter: { reply, setHeader },
  } as unknown as HttpAdapterHost;
  const filter = new GlobalExceptionFilter(adapterHost);
  let loggerError: jest.SpyInstance;

  const hostFor = (request: Record<string, unknown>) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => ({}),
      }),
    }) as any;

  beforeEach(() => {
    reply.mockClear();
    setHeader.mockClear();
    loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    loggerError.mockRestore();
  });

  it('returns the stable contract for typed application errors', () => {
    filter.catch(
      new ApplicationError('QUOTA_EXCEEDED', '今日转换次数已用完', {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        retryable: true,
      }),
      hostFor({ headers: { 'x-request-id': 'request-123' } }),
    );

    expect(reply).toHaveBeenCalledWith(
      {},
      {
        statusCode: 429,
        code: 'QUOTA_EXCEEDED',
        message: '今日转换次数已用完',
        retryable: true,
        requestId: 'request-123',
      },
      429,
    );
    expect(setHeader).toHaveBeenCalledWith({}, 'x-request-id', 'request-123');
    expect(loggerError).not.toHaveBeenCalled();
  });

  it('hides and logs details from typed application 5xx errors', () => {
    const exception = new ApplicationError(
      'CONVERSION_PROVIDER_FAILED',
      'provider token secret-token was rejected',
      {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        retryable: true,
      },
    );

    filter.catch(exception, hostFor({ headers: { 'x-request-id': 'typed-5xx-id' } }));

    expect(reply).toHaveBeenCalledWith(
      {},
      {
        statusCode: 503,
        code: 'CONVERSION_PROVIDER_FAILED',
        message: '服务器内部错误',
        retryable: true,
        requestId: 'typed-5xx-id',
      },
      503,
    );
    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining('typed-5xx-id'),
      exception.stack,
    );
    expect(loggerError.mock.calls[0][0]).toContain('provider token secret-token was rejected');
  });

  it('preserves validation message arrays and assigns a stable code', () => {
    filter.catch(
      new BadRequestException({ message: ['file must be a PDF', 'file is too large'] }),
      hostFor({ headers: {} }),
    );

    expect(reply).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        statusCode: 400,
        code: 'VALIDATION_ERROR',
        message: ['file must be a PDF', 'file is too large'],
        retryable: false,
        requestId: expect.any(String),
      }),
      400,
    );
  });

  it('uses the inbound request ID when Express normalizes headers', () => {
    filter.catch(
      new BadRequestException('invalid request'),
      hostFor({
        headers: {},
        get: (name: string) => (name === 'x-request-id' ? 'express-id' : undefined),
      }),
    );

    expect(reply).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ requestId: 'express-id' }),
      400,
    );
  });

  it.each([
    ['contains unsafe characters', 'unsafe id'],
    ['is longer than 128 characters', 'a'.repeat(129)],
    ['is empty', ''],
  ])('replaces an inbound request ID that %s', (_description, requestId) => {
    filter.catch(
      new BadRequestException('invalid request'),
      hostFor({ headers: { 'x-request-id': requestId } }),
    );

    const body = reply.mock.calls[0][1];
    expect(body.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(setHeader).toHaveBeenCalledWith({}, 'x-request-id', body.requestId);
  });

  it('accepts a safe inbound request ID at the maximum length', () => {
    const requestId = `request:${'a'.repeat(120)}`;

    filter.catch(
      new BadRequestException('invalid request'),
      hostFor({ headers: { 'x-request-id': requestId } }),
    );

    expect(reply).toHaveBeenCalledWith({}, expect.objectContaining({ requestId }), 400);
  });

  it.each([408, 429, 502, 503, 504])(
    'marks generic HTTP %i errors as retryable',
    (statusCode) => {
      filter.catch(
        new HttpException('temporary failure', statusCode),
        hostFor({ headers: {} }),
      );

      expect(reply).toHaveBeenCalledWith(
        {},
        expect.objectContaining({ retryable: true }),
        statusCode,
      );
    },
  );

  it.each([400, 401, 404, 409, 500, 501, 505])(
    'does not mark generic HTTP %i errors as retryable',
    (statusCode) => {
      filter.catch(new HttpException('failure', statusCode), hostFor({ headers: {} }));

      expect(reply).toHaveBeenCalledWith(
        {},
        expect.objectContaining({ retryable: false }),
        statusCode,
      );
    },
  );

  it('hides details from unknown internal errors', () => {
    filter.catch(
      new Error('database password leaked'),
      hostFor({ headers: { 'x-request-id': 'safe-id' } }),
    );

    expect(reply).toHaveBeenCalledWith(
      {},
      {
        statusCode: 500,
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误',
        retryable: false,
        requestId: 'safe-id',
      },
      500,
    );
  });

  it('hides and logs details from untyped HTTP 500 errors', () => {
    filter.catch(
      new InternalServerErrorException('database password leaked'),
      hostFor({ headers: { 'x-request-id': 'safe-http-id' } }),
    );

    expect(reply).toHaveBeenCalledWith(
      {},
      {
        statusCode: 500,
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误',
        retryable: false,
        requestId: 'safe-http-id',
      },
      500,
    );
    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining('safe-http-id'),
      expect.any(String),
    );
    expect(loggerError.mock.calls[0][0]).toContain('database password leaked');
  });
});
