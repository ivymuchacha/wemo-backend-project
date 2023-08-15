import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(message ? message : 'Not Found.', HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends HttpException {
  constructor(message?: string) {
    super(message ? message : 'Conflict.', HttpStatus.CONFLICT);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(message ? message : 'Unauthorized.', HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(message ? message : 'Forbidden.', HttpStatus.FORBIDDEN);
  }
}

export class BadRequestException extends HttpException {
  constructor(message?: string) {
    super(message ? message : 'Bad Request.', HttpStatus.BAD_REQUEST);
  }
}
