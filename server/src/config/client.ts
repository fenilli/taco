import { env } from './env';

const port = env('CLIENT_PORT', 5173);

export default {
    port,
    url: env('CLIENT_URL', `http://localhost:${port}`),
};