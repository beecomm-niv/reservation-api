import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { ReservationsController } from '../controllers/reservations.controller';

const router = Router();

router.post('/', AuthController.verify('user', true, 'sync'), ReservationsController.setReservation);

router.post('/pos/watch', AuthController.verify('super_admin', true, 'pos-sync'), ReservationsController.posWatch);

router.post('/pos/orders', AuthController.verify('super_admin', true, 'pos-sync'), ReservationsController.finishPosOrders);

export const reservationsRouter = router;
