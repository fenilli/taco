import { EnvUtils } from '#utils/env';

export const auth = {
    jwtSecret: EnvUtils.get('JWT_SECRET'),
    jwtExpire: EnvUtils.get('JWT_EXPIRY', '15m'),
    jwtRefreshSecret: EnvUtils.get('JWT_REFRESH_SECRET'),
    jwtRefreshExpire: EnvUtils.get('JWT_REFRESH_EXPIRY', '30d')
};
