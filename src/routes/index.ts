import { Router } from 'express';
import { syncRouter } from './sync.routes';
import { servicesRouter } from './services.routes';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.use('/sync', AuthController.verify('sync'), syncRouter);
router.use('/service', servicesRouter);

export const appRouter = router;
