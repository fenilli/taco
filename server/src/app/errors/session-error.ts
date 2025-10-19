import { HttpError } from '#app/errors/http-error';
import { HttpStatus, ErrorCode } from '#constants';

export class SessionError extends HttpError {
    private constructor(message: string, status: HttpStatus, public code: ErrorCode) {
        super(message, status);
    }

    context(): Record<string, any> {
        return {
            message: this.message,
            code: this.code,
        };
    }

    static NotFound(sessionId: number) {
        return new SessionError(
            `Session with ID ${sessionId} not found`,
            HttpStatus.NOT_FOUND,
            ErrorCode.SESSION_NOT_FOUND
        );
    }
}
