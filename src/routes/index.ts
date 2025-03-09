import { Router } from 'express';
import { reservationsRouter } from './reservations.routes';
import { servicesRouter } from './services.routes';

const router = Router();

router.use('/reservations', reservationsRouter);
router.use('/service', servicesRouter);

export const appRouter = router;
