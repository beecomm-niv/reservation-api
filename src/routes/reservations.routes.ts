import { Router } from 'express';
import { ReservationsController } from '../controllers/reservations.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

/**
 * @param {string} - get single reservations from database.
 */
router.get('/:id', AuthController.verify('user', true, 'sync'), ReservationsController.getReservation);

/**
 * @param {Sync} - set reservation from host service, store it in the database and stream it to the relevant pos using adapter.
 */
router.post('/', AuthController.verify('service', true, 'sync'), ReservationsController.setReservation);

/**
 * @param {ReservationDto[]} - get reservation list from the pos, store it in the databsae and stream in to the host service.
 */
router.post('/pos', AuthController.verify('super_admin', true, 'sync'), ReservationsController.setPosReservations);

/**
 * @param {OrderDto[]} - get full orders from the pos service with thair syncId, and merge it to the relevant reservation and stream in to the host service.
 */
router.post('/pos/orders', AuthController.verify('super_admin', true, 'sync'), ReservationsController.mergeOrdersToReservations);

// router.post('/query/phone', AuthController.verify('admin', true, 'sync'), ReservationsController.queryReservationsByClientPhone);
// router.post('/query/branch', AuthController.verify('admin', true, 'sync'), ReservationsController.queryReservationsByBranch);

export const reservationsRouter = router;
