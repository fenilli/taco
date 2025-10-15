import { Router } from 'express';

import { notFoundHandler, errorHandler } from '#core/middlewares/error.middleware';

import authRoutes from './auth.route';

const router = Router();

router.use('/auth', authRoutes);

router.use(notFoundHandler);
router.use(errorHandler);

export default router;