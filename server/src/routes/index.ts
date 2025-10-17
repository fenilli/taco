import { Application, Router } from 'express';

import { HttpStatus } from '#/constants';
import { errorHandler } from '#/middleware/error.middleware';
import { authenticate } from '#/features/auth/auth.middleware';
import authRoutes from '#/features/auth/auth.routes';
import userRoutes from '#/features/user/user.routes';
import sessionRoutes from '#/features/session/session.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', authenticate, userRoutes);
router.use('/sessions', authenticate, sessionRoutes);

export const setupRoutes = (app: Application) => {
    app.use(router);

    app.get('/', (_, res) => res.status(HttpStatus.Ok).send({ message: 'API is running.' }));

    app.use(errorHandler);
};
