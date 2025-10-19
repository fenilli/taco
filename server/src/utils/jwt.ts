import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

export const JWTUtils = {
    sign: <P extends JwtPayload>(payload: P, { secret, ...jwtOptions }: SignOptions & { secret: string }) => {
        return jwt.sign(payload, secret, jwtOptions);
    },

    verify: <P extends JwtPayload>(token: string, { secret, ...jwtOptions }: VerifyOptions & { secret: string }): P | null => {
        try {
            return jwt.verify(token, secret, jwtOptions) as P;
        } catch {
            return null;
        }
    },
};

export type { SignOptions, VerifyOptions };
