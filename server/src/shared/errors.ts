import { HttpStatus } from '#shared/http';

export const enum AppErrorCodes {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    CONFLICT_ERROR = 'CONFLICT_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
};

export class AppError extends Error {
    public readonly statusCode: HttpStatus;
    public readonly errorCode?: AppErrorCodes;

    constructor(message: string, statusCode: HttpStatus, errorCode?: AppErrorCodes) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, HttpStatus.BadRequest, AppErrorCodes.VALIDATION_ERROR);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, HttpStatus.Conflict, AppErrorCodes.CONFLICT_ERROR);
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found.`, HttpStatus.NotFound, AppErrorCodes.NOT_FOUND);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, HttpStatus.Unauthorized, AppErrorCodes.UNAUTHORIZED);
    }
}