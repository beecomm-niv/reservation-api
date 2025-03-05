import { Router } from 'express';
import { syncRouter } from './sync.routes';

const router = Router();

router.use('/sync', syncRouter);

export const appRouter = router;
