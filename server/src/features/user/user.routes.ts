import { Router } from 'express';

import { getUserHandler } from './user.controller';

const router = Router();

router.get('/', getUserHandler);

export default router;
