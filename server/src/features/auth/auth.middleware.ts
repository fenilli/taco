import { RequestHandler } from 'express';

import { AppErrorCode } from '#/constants';
import { UnauthorizedError } from '#/error/http.error';
import { verifyAccessToken } from './auth.service';

export const authenticate: RequestHandler = (
    req,
    _,
    next
) => {
    const { accessToken } = req.cookies;
    if (!accessToken) throw new UnauthorizedError('Not authorized.', AppErrorCode.InvalidAccessToken);

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new UnauthorizedError('Token expired.', AppErrorCode.InvalidAccessToken);

    req.user_id = payload.user_id;
    req.session_id = payload.session_id;

    next();
};
