import { Router } from 'express';
import { authenticate } from '#middlewares/auth';
import { SessionController } from '#app/controllers/session';

export const SessionRouter = Router();

SessionRouter.use(authenticate);

SessionRouter.get('/', SessionController.index);
SessionRouter.delete('/:id', SessionController.destroy);
