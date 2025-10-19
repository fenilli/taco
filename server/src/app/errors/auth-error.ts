import { HttpError } from "#app/errors/http-error";
import { ErrorCode, HttpStatus } from "#constants";

export class AuthError extends HttpError {
    private constructor(message: string, status: HttpStatus, public code: ErrorCode) {
        super(message, status);
    }

    context(): Record<string, any> {
        return {
            message: this.message,
            code: this.code,
        }
    }

    static InvalidCredentials() {
        return new AuthError('Invalid credentials', HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_CREDENTIALS);
    }

    static InvalidAccessToken() {
        return new AuthError('Invalid access token', HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_ACCESS_TOKEN);
    }

    static InvalidRefreshToken() {
        return new AuthError('Invalid refresh token', HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_REFRESH_TOKEN);
    }

    static ExpiredAccessToken() {
        return new AuthError('Access token expired', HttpStatus.UNAUTHORIZED, ErrorCode.EXPIRED_ACCESS_TOKEN);
    }

    static ExpiredRefreshToken() {
        return new AuthError('Refresh token expired', HttpStatus.UNAUTHORIZED, ErrorCode.EXPIRED_REFRESH_TOKEN);
    }
}
