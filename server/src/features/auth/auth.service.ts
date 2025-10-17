import bcrypt from 'bcrypt';

import { AppErrorCode, HttpStatus } from '#/constants';
import { HttpError } from '#/errors/http.error';
import { InvalidTokenError, ExpiredTokenError } from '#/errors/app.error';
import { UserService } from '#/features/user/user.service';
import { SessionService } from '#/features/session/session.service';
import { omit } from '#/utils/object.utils';
import date from '#/utils/date.utils';
import {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
} from './auth.utils';

type RegisterParams = {
    email: string;
    password: string;
};

type LoginParams = {
    email: string;
    password: string;
    userAgent?: string;
};

type LogoutParams = {
    accessToken?: string;
};

type RefreshParams = {
    refreshToken?: string;
};

export const AuthService = {
    register: async ({ email, password }: RegisterParams) => {
        const user = await UserService.findByEmail(email);
        if (user) throw new HttpError('Email already in use', HttpStatus.Conflict);

        return await UserService.create({
            email,
            password,
        });
    },
    login: async ({ email, password, userAgent }: LoginParams) => {
        const user = await UserService.findByEmail(email);

        if (!user) throw new HttpError('Invalid email or password.', HttpStatus.Unauthorized);
        if (!await bcrypt.compare(password, user.password)) throw new HttpError('Invalid email or password.', HttpStatus.Unauthorized);

        const session = await SessionService.create({
            user_id: user.user_id,
            user_agent: userAgent,
        });

        const accessToken = signAccessToken({ user_id: user.user_id, session_id: session.session_id });
        const refreshToken = signRefreshToken({ session_id: session.session_id });

        return { user: omit(user, ['password']), accessToken, refreshToken };
    },
    logout: async ({ accessToken }: LogoutParams) => {
        if (!accessToken) throw new InvalidTokenError(AppErrorCode.InvalidAccessToken);

        const payload = verifyAccessToken(accessToken);

        if (!payload) throw new InvalidTokenError(AppErrorCode.InvalidAccessToken);

        await SessionService.delete({ session_id: payload.session_id });
    },
    refresh: async ({ refreshToken }: RefreshParams) => {
        if (!refreshToken) throw new InvalidTokenError(AppErrorCode.InvalidRefreshToken);

        const payload = verifyRefreshToken(refreshToken);

        if (!payload) throw new InvalidTokenError(AppErrorCode.InvalidRefreshToken);

        const session = await SessionService.findById(payload.session_id);

        if (!session || date.isBefore(session.expires_at, date.now())) throw new ExpiredTokenError(AppErrorCode.ExpiredAccessToken);
        await SessionService.update(session.session_id, { expires_at: date.add(date.now(), { days: 30 }) });

        const accessToken = signAccessToken({ user_id: session.user_id, session_id: session.session_id });
        const newRefreshToken = signRefreshToken({ session_id: session.session_id });

        return { accessToken, refreshToken: newRefreshToken };
    },
};
