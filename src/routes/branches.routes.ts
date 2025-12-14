import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { BranchesController } from '../controllers/branches.controller';

const router = Router();

router.post('/', AuthController.verify([], '*'), BranchesController.createBranch);
router.post('/sync', AuthController.verify(['service'], 'watch'), BranchesController.syncBranch);

router.get('/:id', AuthController.verify(['user'], '*'), BranchesController.getBranchById);

router.put('/', AuthController.verify(['user'], '*'), BranchesController.updateBranch);

export const branchesRouter = router;
