import { ErrorRequestHandler, RequestHandler } from 'express';

import { AppErrorCode } from '#/constants';
import {
    InvalidTokenError,
    ExpiredTokenError,
} from '#/errors/app.error';
import { clearAuthCookies, verifyAccessToken } from './auth.utils';

export const authenticate: RequestHandler = (
    req,
    _,
    next
) => {
    const { accessToken } = req.cookies;
    if (!accessToken) throw new InvalidTokenError(AppErrorCode.InvalidAccessToken);

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new ExpiredTokenError(AppErrorCode.ExpiredAccessToken);

    req.user_id = payload.user_id;
    req.session_id = payload.session_id;

    next();
};

export const authErrorHandler: ErrorRequestHandler = (err, _, res, next) => {
    if (err instanceof ExpiredTokenError) return clearAuthCookies(res).status(err.httpStatusCode).json({
        message: err.message,
        erroCode: err.appErrorCode,
    });

    return next(err);
};
