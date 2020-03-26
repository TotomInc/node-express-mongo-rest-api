import { Router } from 'express';

import authRoutes from './auth/auth.routes';

/**
 * Express router to be mounted under `/api` path.
 */
const router = Router();

router.get('/heartbeat', (req, res) => res.json('OK'));

router.use('/auth', authRoutes);

export default router;
