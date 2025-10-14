import { HttpStatus, AppErrorCode } from '#utils/constants';

export class AppError extends Error {
    constructor(public statusCode: HttpStatus, public message: string, public errorCode?: AppErrorCode) {
        super(message);
    }
}