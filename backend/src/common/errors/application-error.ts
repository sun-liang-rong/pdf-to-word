import { HttpStatus } from '@nestjs/common';

export interface ApplicationErrorOptions {
  statusCode?: HttpStatus;
  retryable?: boolean;
}

export class ApplicationError extends Error {
  readonly code: string;
  readonly statusCode: HttpStatus;
  readonly retryable: boolean;

  constructor(
    code: string,
    message: string,
    options: ApplicationErrorOptions = {},
  ) {
    super(message);
    this.name = ApplicationError.name;
    this.code = code;
    this.statusCode = options.statusCode ?? HttpStatus.BAD_REQUEST;
    this.retryable = options.retryable ?? false;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
