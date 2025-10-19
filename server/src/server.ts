import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { Config } from '#config';
import { RouterProvider } from '#providers/router';
import '#providers/database';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: Config.app.url,
    credentials: true,
}));
app.use(cookieParser());

app.use(RouterProvider);

app.listen(3000);
