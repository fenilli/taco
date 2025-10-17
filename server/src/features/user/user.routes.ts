import { Router } from 'express';

import { getUserHandler } from './user.controller';

const router = Router();

router.get('/me', getUserHandler);

export default router;
