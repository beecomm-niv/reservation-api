import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';

const router = Router();

router.get('/:id', SyncController.getSync);
router.post('/', SyncController.setSync);
router.post('/query', SyncController.querySync);
router.post('/order', SyncController.setOrderToReservation);

export const syncRouter = router;
