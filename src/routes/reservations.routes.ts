import { Router } from 'express';
import { ReservationsController } from '../controllers/reservations.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.get('/:id', AuthController.verify('super_admin', false), ReservationsController.getReservation);

router.post('/', AuthController.verify('user', true, 'sync'), ReservationsController.setReservation);

router.post('/pos', AuthController.verify('super_admin', true, 'pos-sync'), ReservationsController.setPosReservations);

router.post('/pos/orders', AuthController.verify('super_admin', true, 'pos-sync'), ReservationsController.mergeOrdersToReservations);

// router.post('/query/phone', AuthController.verify('admin', true, 'sync'), ReservationsController.queryReservationsByClientPhone);
// router.post('/query/branch', AuthController.verify('admin', true, 'sync'), ReservationsController.queryReservationsByBranch);

export const reservationsRouter = router;
