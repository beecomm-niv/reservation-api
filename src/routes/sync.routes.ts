import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';

const router = Router();

router.get('/:id', SyncController.getReservation);
router.post('/', SyncController.setReservation);
router.post('/query', SyncController.queryReservations);
router.post('/order', SyncController.setOrderToReservation);

export const syncRouter = router;
