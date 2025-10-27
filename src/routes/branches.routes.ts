import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { BranchesController } from '../controllers/branches.controller';

const router = Router();

router.post('/', AuthController.verify(['super_admin'], '*'), BranchesController.createBranch);

router.get('/:id', AuthController.verify(['user'], '*'), BranchesController.getBranchById);

router.put('/', AuthController.verify(['user'], '*'), BranchesController.updateBranch);

export const branchesRouter = router;
