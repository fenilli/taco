import { Router } from 'express';

import { errorHandler } from '#/middleware/error.middleware';
import guestRoutes from './guest.routes';
import protectedRoutes from './protected.routes';

const router = Router();

router.use(guestRoutes);
router.use(protectedRoutes);

router.use(errorHandler);

export default router;
