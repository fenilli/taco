import { Router } from 'express';
import { authenticate } from '#middlewares/auth';
import { UserController } from '#app/controllers/user';

export const UserRouter = Router();

UserRouter.use(authenticate);

UserRouter.get('/me', UserController.me);
