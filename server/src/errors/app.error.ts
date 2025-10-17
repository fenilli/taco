import { HttpError } from './http.error';
import { HttpStatus, AppErrorCode } from '#/constants';

export class AppError extends HttpError {
    constructor(message: string, public appErrorCode: AppErrorCode, httpStatusCode: HttpStatus = HttpStatus.InternalServerError) {
        super(message, httpStatusCode);
    }
}

export class InvalidTokenError extends AppError {
    constructor(appErrorCode: AppErrorCode.InvalidAccessToken | AppErrorCode.InvalidRefreshToken) {
        super('Invalid authentication token.', appErrorCode, HttpStatus.Unauthorized);
    }
}

export class ExpiredTokenError extends AppError {
    constructor(appErrorCode: AppErrorCode.ExpiredAccessToken | AppErrorCode.ExpiredRefreshToken) {
        super(`Expired authentication token.`, appErrorCode, HttpStatus.Unauthorized);
    }
}
