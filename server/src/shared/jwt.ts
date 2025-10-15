import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import config from '#config';

const accessSecret = config.get('jwt.secret');
const refreshSecret = config.get('jwt.refreshSecret');

export interface AccessPayload extends JwtPayload {
    user_id: number;
    session_id: number;
}

export interface RefreshPayload extends JwtPayload {
    session_id: number;
}

export const signAccessToken = (payload: AccessPayload): string => {
    const options: SignOptions = {
        audience: ['user'],
        expiresIn: '15m',
    };

    return jwt.sign(payload, accessSecret, options);
};

export const signRefreshToken = (payload: RefreshPayload): string => {
    const options: SignOptions = {
        audience: ['user'],
        expiresIn: '30d',
    };

    return jwt.sign(payload, refreshSecret, options);
};

export function verifyAccessToken(token: string): AccessPayload | null {
    try {
        const decoded = jwt.verify(token, accessSecret, { audience: ['user'], });
        return decoded as AccessPayload;
    } catch {
        return null;
    }
};

export function verifyRefreshToken(token: string): RefreshPayload | null {
    try {
        const decoded = jwt.verify(token, refreshSecret, { audience: ['user'], });
        return decoded as RefreshPayload;
    } catch {
        return null;
    }
};