import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/', AuthController.verify([], '*'), UsersController.createUser);

router.post('/login', UsersController.getUserByEmailAndPassword);

router.get('/refresh', AuthController.verify(['user'], '*'), UsersController.getUserFromToken);

router.put('/', AuthController.verify([], '*'), UsersController.updateUser);

export const usersRouter = router;
