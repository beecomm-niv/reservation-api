import { Router } from 'express';
import { reservationsRouter } from './reservations.routes';
import { servicesRouter } from './services.routes';
import { PingController } from '../controllers/ping.controller';

const router = Router();

router.get('/', PingController.ping);

router.use('/reservations', reservationsRouter);
router.use('/service', servicesRouter);

export const appRouter = router;
