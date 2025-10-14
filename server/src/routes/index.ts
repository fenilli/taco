import { Router } from 'express';

import {
    notFoundHandler,
    errorHandler,
} from '#app/middlewares/error.middleware';

import statusRoutes from './status.route';
import authRoutes from './auth.route';

const router = Router();

router.use(statusRoutes);
router.use('/auth', authRoutes);

router.use(notFoundHandler);
router.use(errorHandler);

export default router;