import { Router } from 'express';
import { register, login, logout, refresh } from '#app/controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/refresh', refresh);

export default router;