import { Application, Router } from 'express';

import { HttpStatus } from '#/constants';
import { errorHandler } from '#/middleware/error.middleware';
import authRoutes from '#/features/auth/auth.routes';

const router = Router();

router.use('/auth', authRoutes);

export const setupRoutes = (app: Application) => {
    app.use(router);

    app.get('/', (_, res) => res.status(HttpStatus.Ok).send({ message: 'API is running.' }));

    app.use(errorHandler);
};