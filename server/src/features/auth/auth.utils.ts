import { Response } from 'express';

import config from '#/config';
import { setCookies, clearCookies } from '#/utils/cookie.utils';
import { SignOptions, signToken, VerifyOptions, verifyToken } from '#/utils/jwt.utils';
import date from '#/utils/date.utils';

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): Response => {
    return setCookies(res, [
        {
            name: 'accessToken',
            value: accessToken,
            options: {
                expires: date.add(date.now(), { minutes: 15 }),
            }
        },
        {
            name: 'refreshToken',
            value: refreshToken,
            options: {
                expires: date.add(date.now(), { days: 30 }),
                path: '/auth/refresh'
            }
        },
    ]);
};

export const clearAuthCookies = (res: Response): Response => {
    return clearCookies(res, [
        { name: 'accessToken' },
        {
            name: 'refreshToken',
            options: {
                path: '/auth/refresh'
            }
        },
    ]);
};

type AccessTokenPayload = {
    user_id: number;
    session_id: number;
};

type RefreshTokenPayload = {
    session_id: number;
};

export const signAccessToken = (payload: AccessTokenPayload) => {
    const accessTokenSecret = config.auth.accessTokenSecret;

    const options: SignOptions = {
        audience: ['user'],
        expiresIn: '15m',
    };

    return signToken(payload, { secret: accessTokenSecret, ...options });
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
    const refreshTokenSecret = config.auth.refreshTokenSecret;

    const options: SignOptions = {
        audience: ['user'],
        expiresIn: '30d',
    };

    return signToken(payload, { secret: refreshTokenSecret, ...options });
};

export const verifyRefreshToken = (refreshToken: string) => {
    const refreshTokenSecret = config.auth.refreshTokenSecret;

    const options: VerifyOptions = {
        audience: ['user'],
    };

    return verifyToken<RefreshTokenPayload>(refreshToken, { secret: refreshTokenSecret, ...options });
};

export const verifyAccessToken = (accessToken: string) => {
    const accessTokenSecret = config.auth.accessTokenSecret;

    const options: VerifyOptions = {
        audience: ['user'],
    };

    return verifyToken<AccessTokenPayload>(accessToken, { secret: accessTokenSecret, ...options });
};
