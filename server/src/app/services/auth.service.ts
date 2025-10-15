import bcrypt from 'bcrypt';

import date from '#shared/date';
import { HttpStatus } from '#shared/http';
import { ConflictError, UnauthorizedError, ValidationError } from '#shared/errors';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '#shared/jwt';

import { User } from '#app/models/user.model';
import { Session } from '#app/models/session.model';

type CreateUserParams = {
    email: string;
    password: string;
};

export const createUser = async ({ email, password }: CreateUserParams) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new ConflictError('Email already in use');

    await User.create({
        email,
        password: await bcrypt.hash(password, 10),
    });
};

type LoginParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const loginUser = async ({ email, password, userAgent }: LoginParams) => {
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password))
        throw new UnauthorizedError('Invalid email or password.');

    const session = await Session.create({
        user_id: user.user_id,
        user_agent: userAgent,
        expires_at: date.add(date.today(), { days: 30 }),
    });

    const accessToken = signAccessToken({ user_id: user.user_id, session_id: session.session_id });
    const refreshToken = signRefreshToken({ session_id: session.session_id });

    return { user: User.omit(user, ['password']), accessToken, refreshToken };
};

type LogoutParams = {
    accessToken?: string;
};

export const logoutUser = async ({ accessToken }: LogoutParams) => {
    if (!accessToken) throw new UnauthorizedError('Missing access token.');

    const payload = verifyAccessToken(accessToken);
    if (!payload) throw new UnauthorizedError('Invalid access token.');

    await Session.delete(payload.session_id);
    return { message: 'Logged out successfully.' };
};

type RefreshParams = {
    refreshToken?: string;
};

export const refreshUserAccessToken = async ({ refreshToken }: RefreshParams) => {
    if (!refreshToken) throw new UnauthorizedError('Missing refresh token.');

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) throw new UnauthorizedError('Invalid refresh token.');

    const session = await Session.findById(payload.session_id);
    const now = date.today();

    if (!session || session.expires_at.getTime() < now.getTime())
        throw new UnauthorizedError('Session expired.');

    const needsRefresh = now >= date.sub(session.expires_at, { days: 1 });
    if (needsRefresh)
        await Session.update(session.session_id, { expires_at: date.add(now, { days: 30 }) });

    const accessToken = signAccessToken({ user_id: session.user_id, session_id: session.session_id });
    const newRefreshToken = needsRefresh ? signRefreshToken({ session_id: session.session_id }) : undefined;

    return { accessToken, refreshToken: newRefreshToken };
};