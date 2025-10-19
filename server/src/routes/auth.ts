import { Router } from 'express';
import { AuthController } from '#app/controllers/auth';

export const AuthRouter = Router();

AuthRouter.post('/register', AuthController.register);
AuthRouter.post('/login', AuthController.login);
AuthRouter.get('/logout', AuthController.logout);
AuthRouter.get('/refresh', AuthController.refresh);
