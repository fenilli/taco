import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '#config';
import date from '#utils/date';
import { HttpStatus } from '#utils/constants';
import { AppError } from '#app/errors/app.error';
import { User } from '#app/models/user.model';
import { Session } from "#app/models/session.model";

type CreateAccountParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
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
    accessToken: string;
};

export const logoutUser = async (data: LogoutParams) => {
    try {
        const payload = jwt.verify(data.accessToken, config.get('jwt.secret'), { audience: ['user'] }) as {
            session_id: string;
        };

        await Session.delete(payload.session_id);

        return { status: HttpStatus.Ok, message: 'Loged out successfully.' };
    } catch (err) {
        console.error(err);
        return { status: HttpStatus.BadRequest, message: 'Could not log out of this session.' };
    }
};