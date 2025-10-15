import type { Response, CookieOptions } from 'express';

import config from '#config';
import date from '#shared/date';

const baseOptions: CookieOptions = {
    sameSite: 'strict',
    httpOnly: true,
    secure: config.get('app.env') !== 'development',
};

const refreshPath = config.get('cookie.refreshPath');

export const setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken?: string
) => {
    res.cookie('accessToken', accessToken, {
        ...baseOptions,
        expires: date.add(date.today(), { minutes: 15 }),
    });

    if (refreshToken) res.cookie('refreshToken', refreshToken, {
        ...baseOptions,
        expires: date.add(date.today(), { days: 15 }),
        path: refreshPath,
    });

    return res;
};

export const cleanAuthCookies = (res: Response) => {
    res
        .clearCookie('accessToken')
        .clearCookie('refreshToken', { path: refreshPath });

    return res;
};