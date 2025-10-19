import { RequestHandler } from 'express';
import { AuthError } from '#app/errors/auth-error';
import { AuthCookieUtils } from '#utils/auth/cookie';
import { AuthJWTUtils } from '#utils/auth/jwt';

export const authenticate: RequestHandler = (
    req,
    _,
    next,
) => {
    const accessToken = AuthCookieUtils.getAccessToken(req);
    if (!accessToken) throw AuthError.InvalidAccessToken();

    const payload = AuthJWTUtils.verifyAccessToken(accessToken);
    if (!payload) throw AuthError.ExpiredAccessToken();

    req.userId = payload.user_id;
    req.sessionId = payload.session_id;

    next();
};
