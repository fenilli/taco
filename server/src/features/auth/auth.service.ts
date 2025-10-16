import { Response } from 'express';
import bcrypt from 'bcrypt';

import config from '#/config';
import { ConflictError, UnauthorizedError } from '#/error/http.error';
import * as UserService from '#/features/user/user.service';
import * as SessionService from '#/features/session/session.service';
import { omit } from '#/utils/object.utils';
import date from '#/utils/date.utils';
import { setCookies, clearCookies } from '#/utils/cookie.utils';
import { SignOptions, signToken, VerifyOptions, verifyToken } from '#/utils/jwt.utils';

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

const signAccessToken = (payload: AccessTokenPayload) => {
    const accessTokenSecret = config.auth.accessTokenSecret;

    const options: SignOptions = {
        audience: ['user'],
        expiresIn: '15m',
    };

    return signToken(payload, { secret: accessTokenSecret, ...options });
};

const signRefreshToken = (payload: RefreshTokenPayload) => {
    const refreshTokenSecret = config.auth.refreshTokenSecret;

    const options: SignOptions = {
        audience: ['user'],
        expiresIn: '30d',
    };

    return signToken(payload, { secret: refreshTokenSecret, ...options });
};

const verifyRefreshToken = (refreshToken: string) => {
    const refreshTokenSecret = config.auth.refreshTokenSecret;

    const options: VerifyOptions = {
        audience: ['user'],
    };

    return verifyToken<RefreshTokenPayload>(refreshToken, { secret: refreshTokenSecret, ...options });
};

const verifyAccessToken = (refreshToken: string) => {
    const accessTokenSecret = config.auth.accessTokenSecret;

    const options: VerifyOptions = {
        audience: ['user'],
    };

    return verifyToken<AccessTokenPayload>(refreshToken, { secret: accessTokenSecret, ...options });
};

type RegisterParams = {
    email: string;
    password: string;
};

type LoginParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const register = async ({ email, password }: RegisterParams) => {
    const user = await UserService.findUserByEmail(email);
    if (user) throw new ConflictError('Email already in use');

    return await UserService.createUser({
        email,
        password,
    });
};

export const login = async ({ email, password, userAgent }: LoginParams) => {
    const user = await UserService.findUserByEmail(email);

    if (!user) throw new UnauthorizedError('Invalid email or password.');
    if (!await bcrypt.compare(password, user.password)) throw new UnauthorizedError('Invalid email or password.');

    const session = await SessionService.createSession({
        user_id: user.user_id,
        user_agent: userAgent,
    });

    const accessToken = signAccessToken({ user_id: user.user_id, session_id: session.session_id });
    const refreshToken = signRefreshToken({ session_id: session.session_id });

    return { user: omit(user, ['password']), accessToken, refreshToken };
};

type LogoutParams = {
    accessToken?: string;
};

export const logout = async ({ accessToken }: LogoutParams) => {
    if (!accessToken) throw new UnauthorizedError('Missing authentication token.');

    const payload = verifyAccessToken(accessToken);

    if (!payload) throw new UnauthorizedError('Invalid authentication token.');

    await SessionService.deleteSession(payload.session_id);
};

type RefreshParams = {
    refreshToken?: string;
};

export const refresh = async ({ refreshToken }: RefreshParams) => {
    if (!refreshToken) throw new UnauthorizedError('Missing authentication token.');

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) throw new UnauthorizedError('Invalid authentication token.');

    const session = await SessionService.findUserById(payload.session_id);

    if (!session || date.isBefore(session.expires_at, date.now())) throw new UnauthorizedError('Invalid authentication token.');
    await SessionService.updateSession(session.session_id, { expires_at: date.add(date.now(), { days: 30 }) });

    const accessToken = signAccessToken({ user_id: session.user_id, session_id: session.session_id });
    const newRefreshToken = signRefreshToken({ session_id: session.session_id });

    return { accessToken, refreshToken: newRefreshToken };
};
