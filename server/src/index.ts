import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from '#/config';
import { setupRoutes } from '#/routes';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

setupRoutes(app);

const startServer = () => {
    app.listen(config.app.port, () => {
        console.info(`Server running on port ${config.app.port} in ${config.app.env} mode.`);
    });
};

startServer();
