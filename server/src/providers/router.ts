import { Router } from 'express';
import { HttpStatus } from '#constants';
import { errorHandler } from '#middlewares/error';
import { AuthRouter } from '#routes/auth';
import { UserRouter } from '#routes/user';
import { SessionRouter } from '#routes/session';

export const RouterProvider = Router();

RouterProvider.use('/auth', AuthRouter);
RouterProvider.use('/users', UserRouter);
RouterProvider.use('/sessions', SessionRouter);

RouterProvider.get('/', (_, res) => res.status(HttpStatus.OK)
    .send({ message: 'API is running.' }));

RouterProvider.use(errorHandler);
