import type { RequestHandler } from 'express';

import { HttpStatus } from '#shared/http';
import { setAuthCookies, cleanAuthCookies } from '#shared/cookies';
import { createUser, loginUser, logoutUser, refreshUserAccessToken } from '#app/services/auth.service';
import { registerSchema, loginSchema } from './auth.schemas';

export const register: RequestHandler = async (req, res) => {
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    await createUser(request);

    return res.status(HttpStatus.Created).json({ message: 'User created successfully.' });
};

export const login: RequestHandler = async (req, res) => {
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    const { user, accessToken, refreshToken } = await loginUser(request);

    return setAuthCookies(res, accessToken, refreshToken).status(HttpStatus.Ok).json({ user, message: 'Logged in successfully.' });
};

export const logout: RequestHandler = async (req, res) => {
    const { message } = await logoutUser(req.cookies);

    return cleanAuthCookies(res).status(HttpStatus.Ok).json({ message });
};

export const refresh: RequestHandler = async (req, res) => {
    const { accessToken, refreshToken } = await refreshUserAccessToken(req.cookies);

    return setAuthCookies(res, accessToken, refreshToken).status(HttpStatus.Ok).json({ message: 'Access token refreshed.' });
};