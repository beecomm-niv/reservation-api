import { USER_ROLE } from './jwt-payload.model';

export interface User {
  userId: string;
  email: string;
  password?: string;

  role: USER_ROLE;
  beeBranchId: string;
  hostBranchId: string;
}
