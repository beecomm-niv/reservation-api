import { Router } from 'express';
import { ReservationsController } from '../controllers/reservations.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.get('/:id', AuthController.verify('user', false), ReservationsController.getReservation);
router.post('/', AuthController.verify('service', true, 'sync'), ReservationsController.setReservation);

// router.post('/query', SyncController.queryReservations);
// router.post('/order', SyncController.setOrderToReservation);

export const reservationsRouter = router;
