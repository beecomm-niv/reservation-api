import { Router } from 'express';
import { ServiceController } from '../controllers/services.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/create', AuthController.verify('*'), ServiceController.createService);
router.post('/token', ServiceController.getToken);

export const servicesRouter = router;
