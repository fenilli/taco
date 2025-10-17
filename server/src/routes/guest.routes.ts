import { Router } from 'express';

import { HttpStatus } from '#/constants';
import authRoutes from '#/features/auth/auth.routes';

const router = Router();

router.use('/auth', authRoutes);

router.get('/', (_, res) => res.status(HttpStatus.Ok).send({ message: 'API is running.' }));

export default router;
