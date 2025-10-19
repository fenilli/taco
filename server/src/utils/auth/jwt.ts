import { JWTUtils, type VerifyOptions, type SignOptions } from '#utils/jwt';
import { Config } from '#config';

type AccessTokenPayload = {
    user_id: number;
    session_id: number;
};

type RefreshTokenPayload = {
    session_id: number;
};

export const AuthJWTUtils = {
    signAccessToken: (payload: AccessTokenPayload) => {
        const secret = Config.auth.jwtSecret;
        const expires = Config.auth.jwtExpire as `${number}`;

        const options: SignOptions = {
            audience: ['user'],
            expiresIn: expires,
        };

        return JWTUtils.sign(payload, { secret, ...options });
    },

    signRefreshToken: (payload: RefreshTokenPayload) => {
        const secret = Config.auth.jwtRefreshSecret;
        const expires = Config.auth.jwtRefreshExpire as `${number}`;

        const options: SignOptions = {
            audience: ['user'],
            expiresIn: expires,
        };

        return JWTUtils.sign(payload, { secret, ...options });
    },

    verifyAccessToken: (token: string): AccessTokenPayload | null => {
        const secret = Config.auth.jwtSecret;

        const options: VerifyOptions = {
            audience: ['user'],
        };

        return JWTUtils.verify<AccessTokenPayload>(token, { secret, ...options });
    },

    verifyRefreshToken: (token: string): RefreshTokenPayload | null => {
        const secret = Config.auth.jwtRefreshSecret;

        const options: VerifyOptions = {
            audience: ['user'],
        };

        return JWTUtils.verify<RefreshTokenPayload>(token, { secret, ...options });
    }
};
