import { Router } from 'express';
import { syncRouter } from './sync.routes';
import { servicesRouter } from './services.routes';

const router = Router();

router.use('/sync', syncRouter);
router.use('/service', servicesRouter);

export const appRouter = router;
