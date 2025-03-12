import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/', UsersController.createUser);

router.post('/login', UsersController.getUserByEmailAndPassword);

router.get('/refresh', AuthController.verify('user', false), UsersController.getUserFromToken);

export const usersRouter = router;
