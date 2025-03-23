import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { ReservationsController } from '../controllers/reservations.controller';

const router = Router();

router.post('/', AuthController.verify('user', true, 'sync'), ReservationsController.setReservation);

router.post('/pos', AuthController.verify('super_admin', true, 'pos-sync'), ReservationsController.posWatch);

export const reservationsRouter = router;
