import bcrypt from 'bcrypt';
import { AuthError } from '#app/errors/auth-error';
import { UserError } from '#app/errors/user-error';
import { UserService } from '#app/services/user';
import { SessionService } from '#app/services/session';
import { DateUtils } from '#utils/date';
import { ObjectUtils } from '#utils/object';
import { AuthJWTUtils } from '#utils/auth/jwt';
import { Config } from '#config';

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
    userAgent?: string;
};

export const AuthService = {
    register: async ({ email, password }: RegisterParams) => {
        const user = await UserService.findOneByEmail(email);
        if (user) throw UserError.EmailAlreadyInUse(email);

        return await UserService.create({ email, password });
    },

    login: async ({ email, password, userAgent }: LoginParams) => {
        const user = await UserService.findOneByEmail(email);

        if (!user) throw AuthError.InvalidCredentials();
        if (!await bcrypt.compare(password, user.password)) throw AuthError.InvalidCredentials();

        const expiresAt = DateUtils.parse(Config.auth.jwtRefreshExpire);
        const session = await SessionService.create({ user_id: user.user_id, user_agent: userAgent, expires_at: expiresAt });

        const accessToken = AuthJWTUtils.signAccessToken({ user_id: user.user_id, session_id: session.session_id });
        const refreshToken = AuthJWTUtils.signRefreshToken({ session_id: session.session_id });

        return { user: ObjectUtils.omit(user, ['password']), accessToken, refreshToken };
    },

    logout: async ({ accessToken }: LogoutParams) => {
        if (!accessToken) return;

        const payload = AuthJWTUtils.verifyAccessToken(accessToken);
        if (!payload) throw AuthError.InvalidAccessToken();

        await SessionService.deleteById(payload.session_id);
    },

    refresh: async ({ refreshToken, userAgent }: RefreshParams) => {
        if (!refreshToken) throw AuthError.InvalidRefreshToken();

        const payload = AuthJWTUtils.verifyRefreshToken(refreshToken);
        if (!payload) throw AuthError.InvalidRefreshToken();

        const session = await SessionService.findById(payload.session_id);
        if (!session) throw AuthError.ExpiredRefreshToken();

        const isExpiredDate = DateUtils.isBefore(session.expires_at, DateUtils.now());
        if (isExpiredDate) throw AuthError.ExpiredRefreshToken();

        const expiresAt = DateUtils.parse(Config.auth.jwtRefreshExpire);
        await SessionService.update(session.session_id, { user_agent: userAgent, expires_at: expiresAt });

        const accessToken = AuthJWTUtils.signAccessToken({ user_id: session.user_id, session_id: session.session_id });
        const newRefreshToken = AuthJWTUtils.signRefreshToken({ session_id: session.session_id });

        return { accessToken, refreshToken: newRefreshToken };
    }
};
