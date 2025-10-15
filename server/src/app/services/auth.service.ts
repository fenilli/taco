import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '#config';
import date from '#utils/date';
import { HttpStatus } from '#utils/constants';
import { AppError } from '#app/errors/app.error';
import { User } from '#app/models/user.model';
import { Session } from "#app/models/session.model";

type CreateUserParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const createUser = async (data: CreateUserParams) => {
    const existingUser = await User.findOne({
        email: data.email,
    });

    if (existingUser)
        throw new AppError(HttpStatus.Conflict, 'Email already in use');

    await User.create({
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
    });
};

type LoginParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const loginUser = async (data: LoginParams) => {
    const user = await User.findOne({ email: data.email });

    if (!user)
        throw new AppError(HttpStatus.Unauthorized, 'Invalid email or password.');

    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid)
        throw new AppError(HttpStatus.Unauthorized, 'Invalid email or password.');

    const session = await Session.create({
        user_id: user.user_id,
        user_agent: data.userAgent,
        expires_at: date.add(date.today(), { days: 30 }),
    });

    const accessToken = jwt.sign({ user_id: user.user_id, session_id: session.session_id }, config.get('jwt.secret'), {
        audience: ['user'],
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ session_id: session.session_id }, config.get('jwt.refreshSecret'), {
        audience: ['user'],
        expiresIn: '30d',
    });

    return { user: User.omit(user, ['password']), accessToken, refreshToken };
};

type LogoutParams = {
    accessToken?: string;
};

export const logoutUser = async (data: LogoutParams) => {
    if (!data.accessToken)
        throw new AppError(HttpStatus.BadRequest, 'Missing access token.');

    try {
        const payload = jwt.verify(data.accessToken, config.get('jwt.secret'), { audience: ['user'] }) as {
            session_id: number;
        };

        await Session.delete(payload.session_id);

        return { message: 'Loged out successfully.' };
    } catch (_) {
        throw new AppError(HttpStatus.BadRequest, 'Invalid access token.');
    }
};

type RefreshParams = {
    refreshToken?: string;
};

export const refreshUserAccessToken = async (data: RefreshParams) => {
    if (!data.refreshToken)
        throw new AppError(HttpStatus.Unauthorized, 'Missing refresh token.');

    try {
        const payload = jwt.verify(data.refreshToken, config.get('jwt.refreshSecret'), { audience: ['user'] }) as {
            user_id: number;
            session_id: number;
        };

        const session = await Session.findById(payload.session_id);

        const now = date.today();
        if (!session || session.expires_at.getTime() < now.getTime())
            throw new AppError(HttpStatus.Unauthorized, 'Session expired.');

        const needsRefresh = now >= date.sub(session.expires_at, { days: 1 });
        if (needsRefresh) Session.update(session.session_id, {
            expires_at: date.add(now, { days: 30 }),
        });

        const accessToken = jwt.sign({ user_id: session.user_id, session_id: session.session_id }, config.get('jwt.secret'), {
            audience: ['user'],
            expiresIn: '15m',
        });

        const refreshToken = needsRefresh ? jwt.sign({ session_id: session.session_id }, config.get('jwt.refreshSecret'), {
            audience: ['user'],
            expiresIn: '30d',
        }) : null;

        return { accessToken, refreshToken };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(HttpStatus.Unauthorized, 'Invalid refresh token.');
    }
};