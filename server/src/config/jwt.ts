import { env } from './env';

export default {
    secret: env('JWT_SECRET', 'secret'),
    refreshSecret: env('JWT_REFRESH_SECRET', 'refresh_secret'),
};