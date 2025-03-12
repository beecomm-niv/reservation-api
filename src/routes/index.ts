import { Router } from 'express';
import { reservationsRouter } from './reservations.routes';
import { servicesRouter } from './services.routes';
import { PingController } from '../controllers/ping.controller';
import { usersRouter } from './users.routes';

const router = Router();

router.get('/', PingController.ping);

router.use('/reservations', reservationsRouter);
router.use('/service', servicesRouter);
router.use('/users', usersRouter);

export const appRouter = router;
