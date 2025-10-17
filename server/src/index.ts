import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import config from '#/config';
import routes from '#/routes';

const app = express();

app.use(cors({
    origin: config.app.clientUrl,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);

const startServer = () => {
    app.listen(3000, () => {
        console.info(`Server running on port 3000 in ${config.app.env} mode.`);
    });
};

startServer();
