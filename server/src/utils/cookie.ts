import { Response, CookieOptions } from 'express';

type CookieData = {
    name: string;
    value: string;
    options?: CookieOptions;
};

const baseOptions: CookieOptions = {
    sameSite: 'strict',
    httpOnly: true,
    secure: true,
};

export const CookieUtils = {
    set: (res: Response, { name, value, options }: CookieData) => {
        res.cookie(name, value, { ...baseOptions, ...options });
    },
    clear: (res: Response, { name, options }: Omit<CookieData, 'value'>) => {
        res.clearCookie(name, { ...baseOptions, ...options });
    }
};
