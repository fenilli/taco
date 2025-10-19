import { HttpError } from "#app/errors/http-error";
import { ErrorCode, HttpStatus } from "#constants";

export class UserError extends HttpError {
    private constructor(message: string, status: HttpStatus, public code: ErrorCode) {
        super(message, status);
    }

    context(): Record<string, any> {
        return {
            message: this.message,
            code: this.code,
        }
    }

    static NotFound(userId: number) {
        return new UserError(
            `User with ID ${userId} not found`,
            HttpStatus.NOT_FOUND,
            ErrorCode.USER_NOT_FOUND
        );
    }

    static EmailAlreadyInUse(email: string) {
        return new UserError(
            `Email ${email} is already in use`,
            HttpStatus.CONFLICT,
            ErrorCode.EMAIL_ALREADY_IN_USE
        );
    }
}
