import { Request, Response } from 'express';
import { CookieUtils } from '#utils/cookie';
import { DateUtils } from '#utils/date';
import { Config } from '#config';

export const AuthCookieUtils = {
    getAccessToken: (req: Request) => req.cookies?.['access_token'],
    getRefreshToken: (req: Request) => req.cookies?.['refresh_token'],

    setAccessToken: (res: Response, accessToken: string) => {
        CookieUtils.set(res, {
            name: 'access_token',
            value: accessToken,
            options: {
                expires: DateUtils.parse(Config.auth.jwtExpire),
            }
        });
    },

    setRefreshToken: (res: Response, refreshToken: string) => {
        CookieUtils.set(res, {
            name: 'refresh_token',
            value: refreshToken,
            options: {
                path: '/auth/refresh',
                expires: DateUtils.parse(Config.auth.jwtRefreshExpire),
            }
        });
    },

    clearAuthTokens: (res: Response) => {
        CookieUtils.clear(res, { name: 'access_token' });
        CookieUtils.clear(res, {
            name: 'refresh_token', options: {
                path: '/auth/refresh'
            }
        });
    }
};
