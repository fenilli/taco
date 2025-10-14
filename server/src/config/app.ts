import { env } from './env';

const port = env('APP_PORT', 3000);

export default {
    environment: env('APP_ENV', 'development'),
    port,
    url: env('APP_URL', `http://localhost:${port}`),
};