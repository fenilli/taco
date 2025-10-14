import { env } from './env';

export default {
    host: env('DB_HOST', 'database'),
    port: env('DB_PORT', 5432),
    database: env('DB_DATABASE', 'steply'),
    username: env('DB_USERNAME', 'root'),
    password: env('DB_PASSWORD', 'password'),
};