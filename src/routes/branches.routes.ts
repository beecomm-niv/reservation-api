import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { BranchesController } from '../controllers/branches.controller';

const router = Router();

router.post('/', AuthController.verify('super_admin', false), BranchesController.createBranch);

router.get('/:id', AuthController.verify('user', false), BranchesController.getBranchById);

router.put('/', AuthController.verify('user', false), BranchesController.updateBranch);

export const branchesRouter = router;
