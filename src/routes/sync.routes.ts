import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.get('/:id', AuthController.verify('user', false), SyncController.getReservation);
router.post('/', AuthController.verify('service', true, 'sync'), SyncController.setReservation);

// router.post('/query', SyncController.queryReservations);
// router.post('/order', SyncController.setOrderToReservation);

export const syncRouter = router;
