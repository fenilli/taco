import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

export const signToken = <P extends JwtPayload>(
    payload: P,
    { secret, ...jwtOptions }: SignOptions & { secret: string }
) => {
    return jwt.sign(payload, secret, jwtOptions);
};

export const verifyToken = <P extends JwtPayload>(
    token: string,
    { secret, ...jwtOptions }: VerifyOptions & { secret: string }
): P | null => {
    try {
        return jwt.verify(token, secret, jwtOptions) as P;
    } catch {
        return null;
    }
};

export { SignOptions, VerifyOptions };
