import { Router } from 'express';

import { authenticate, authErrorHandler } from '#/features/auth/auth.middleware';
import userRoutes from '#/features/user/user.routes';
import sessionRoutes from '#/features/session/session.routes';

const router = Router();

router.use(authenticate);

router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);

router.use(authErrorHandler);

export default router;
