import { Router } from 'express';
import { ReservationsController } from '../controllers/reservations.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.get('/:id', AuthController.verify('user', true, 'sync'), ReservationsController.getReservation);
router.post('/', AuthController.verify('service', true, 'sync'), ReservationsController.setReservation);
router.post('/order', AuthController.verify('super_admin', true, 'sync'), ReservationsController.setOrderToReservation);

router.post('/query/phone', AuthController.verify('admin', true, 'sync'), ReservationsController.queryReservationsByClientPhone);
router.post('/query/branch', AuthController.verify('admin', true, 'sync'), ReservationsController.queryReservationsByBranch);

export const reservationsRouter = router;
