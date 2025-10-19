import { Request, Response } from 'express';
import { AuthService } from '#app/services/auth';
import { LoginSchema, RegisterSchema } from '#app/schemas/auth';
import { HttpStatus } from '#constants';
import { AuthCookieUtils } from '#utils/auth/cookie';

export const AuthController = {
    register: async (req: Request, res: Response) => {
        const request = RegisterSchema.parse(req.body);

        await AuthService.register(request);

        return res.status(HttpStatus.OK).json({ message: 'User registered successfully' });
    },

    login: async (req: Request, res: Response) => {
        const request = LoginSchema.parse({ ...req.body, userAgent: req.headers['user-agent'] });

        const { user, accessToken, refreshToken } = await AuthService.login(request);

        AuthCookieUtils.setAccessToken(res, accessToken);
        AuthCookieUtils.setRefreshToken(res, refreshToken);

        return res.status(HttpStatus.OK).json({ message: 'Logged in successfully', user });
    },

    logout: async (req: Request, res: Response) => {
        await AuthService.logout({ accessToken: AuthCookieUtils.getAccessToken(req) });

        AuthCookieUtils.clearAuthTokens(res);

        return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
    },

    refresh: async (req: Request, res: Response) => {
        const { accessToken, refreshToken } = await AuthService.refresh({ refreshToken: AuthCookieUtils.getRefreshToken(req), userAgent: req.headers['user-agent'] });

        AuthCookieUtils.setAccessToken(res, accessToken);
        AuthCookieUtils.setRefreshToken(res, refreshToken);

        return res.status(HttpStatus.OK).json({ message: 'Access token refreshed' });
    },
};
