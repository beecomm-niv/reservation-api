import { Router } from 'express';
import { SyncController } from '../controllers/sync.controller';

const router = Router();

router.post('/', SyncController.handleSync);

export const syncRouter = router;
