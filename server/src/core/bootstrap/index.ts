import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from '#config';
import routes from '../routes';

export async function bootstrap(): Promise<Application> {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: `${config.get('client.url')}:${config.get('client.port')}`,
        credentials: true,
    }));
    app.use(cookieParser());

    app.use(routes);

    return app;
}