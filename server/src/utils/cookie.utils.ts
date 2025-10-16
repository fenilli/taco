import { Response, CookieOptions } from 'express';

import config from '#/config';

type CookieData = {
    name: string;
    value: string;
    options?: CookieOptions;
};

const baseOptions: CookieOptions = {
    sameSite: 'strict',
    httpOnly: true,
    secure: config.app.env !== 'development',
};

export const setCookies = (res: Response, cookies: CookieData[]): Response => {
    cookies.forEach((cookie) => {
        res.cookie(cookie.name, cookie.value, { ...baseOptions, ...cookie.options });
    });

    return res;
};

export const clearCookies = (res: Response, cookies: Omit<CookieData, 'value'>[]): Response => {
    cookies.forEach((cookie) => {
        res.clearCookie(cookie.name, cookie.options);
    });

    return res;
};
