import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { ReservationsController } from '../controllers/reservations.controller';

const router = Router();

router.post('/', AuthController.verify(['service'], 'sync'), ReservationsController.setReservation);

router.post('/watch', AuthController.verify(['service'], 'watch'), ReservationsController.posWatch);

export const reservationsRouter = router;
