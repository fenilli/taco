import { Router } from 'express';

import { HttpStatus } from '#utils/constants';

const router = Router();

router.get('/status', (_, res) => {
    return res.status(HttpStatus.Ok).json({ status: 'healthy' });
});

export default router;