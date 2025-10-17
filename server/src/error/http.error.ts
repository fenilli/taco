import { HttpStatus, AppErrorCode } from '#/constants';

export class AppError extends Error {
    constructor(message: string, public statusCode: HttpStatus, public appErrorCode?: AppErrorCode) {
        super(message);
    }
}

export class HttpError extends AppError {
    constructor(message: string, statusCode: HttpStatus, appErrorCode?: AppErrorCode) {
        super(message, statusCode, appErrorCode);
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string = 'Not Found') {
        super(message, HttpStatus.NotFound);
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string = 'Bad Request') {
        super(message, HttpStatus.BadRequest);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string = 'Unauthorized', appErrorCode?: AppErrorCode) {
        super(message, HttpStatus.Unauthorized, appErrorCode);
    }
}

export class ConflictError extends HttpError {
    constructor(message: string = 'Conflict') {
        super(message, HttpStatus.Conflict);
    }
}
