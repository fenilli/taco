import type { CookieOptions, RequestHandler } from 'express';

import { registerSchema, loginSchema } from './auth.schemas';
import config from '#config';
import date from '#utils/date';
import { HttpStatus } from '#utils/constants';
import { createAccount, loginUser, logoutUser } from '#app/services/auth.service';

const refreshUrl = '/auth/refresh';

export const register: RequestHandler = async (req, res) => {
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    await createAccount(request);

    return res.status(HttpStatus.Created).json({ message: 'User created successfully.' });
};

export const login: RequestHandler = async (req, res) => {
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    const { user, accessToken, refreshToken } = await loginUser(request);

    const cookieOptions: CookieOptions = {
        sameSite: 'strict',
        httpOnly: true,
        secure: config.get('app.environment') !== 'development',
    };

    return res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        expires: date.add(date.today(), { minutes: 15 }),
    }).cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        expires: date.add(date.today(), { days: 30 }),
        path: refreshUrl,
    }).status(HttpStatus.Ok).json({ user, message: 'Logged in successfully.' });
};

export const logout: RequestHandler = async (req, res) => {
    const { status, message } = await logoutUser(req.cookies);

    return res.clearCookie('accessToken').clearCookie('refreshToken', { path: refreshUrl }).status(status).json({ message });
};