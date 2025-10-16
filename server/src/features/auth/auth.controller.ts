import { RequestHandler } from 'express';
import z from 'zod';

import { HttpStatus } from '#/constants';
import * as AuthService from './auth.service';

const loginSchema = z.object({
    email: z.email().min(1).max(255),
    password: z.string().min(6).max(255),
    userAgent: z.string().optional(),
});

const registerSchema = loginSchema.extend({
    confirmPassword: z.string().min(6).max(255),
}).refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const registerHandler: RequestHandler = async (req, res) => {
    const request = registerSchema.parse(req.body);

    await AuthService.register(request);

    return res.status(HttpStatus.Created).json({ message: 'User created successfully.' });
};

export const loginHandler: RequestHandler = async (req, res) => {
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    const { user, accessToken, refreshToken } = await AuthService.login(request);

    return AuthService.setAuthCookies(res, accessToken, refreshToken).status(HttpStatus.Ok).json({ user, message: 'Logged in successfully.' });
};

export const logoutHandler: RequestHandler = async (req, res) => {
    await AuthService.logout(req.cookies);

    return AuthService.clearAuthCookies(res).status(HttpStatus.Ok).json({ message: 'Logged out successfully.' });
};

export const refreshHandler: RequestHandler = async (req, res) => {
    const { accessToken, refreshToken } = await AuthService.refresh(req.cookies);

    return AuthService.setAuthCookies(res, accessToken, refreshToken).status(HttpStatus.Ok).json({ message: 'Access token refreshed.' });
};
