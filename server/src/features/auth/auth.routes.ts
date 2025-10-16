import { Router } from 'express';

import { registerHandler, loginHandler, logoutHandler, refreshHandler } from './auth.controller';

const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.get('/logout', logoutHandler);
router.get('/refresh', refreshHandler);

export default router;
