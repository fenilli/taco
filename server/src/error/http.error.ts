import { HttpStatus } from '#/constants';

export class HttpError extends Error {
    constructor(message: string, public statusCode: HttpStatus) {
        super(message);
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string = 'Bad Request') {
        super(message, HttpStatus.BadRequest);
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string = 'Unauthorized') {
        super(message, HttpStatus.Unauthorized);
    }
}

export class ConflictError extends HttpError {
    constructor(message: string = 'Conflict') {
        super(message, HttpStatus.Conflict);
    }
}
