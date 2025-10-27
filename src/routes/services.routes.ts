import { Router } from 'express';
import { ServiceController } from '../controllers/services.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/create', AuthController.verify(['super_admin'], '*'), ServiceController.createService);

router.post('/token', ServiceController.getToken);

router.put('/', AuthController.verify(['super_admin'], '*'), ServiceController.updateService);

export const servicesRouter = router;
