import { Branch } from './branch.model';
import { USER_ROLE } from './jwt-payload.model';

export interface User {
  userId: string;
  email: string;
  password: string;
  name: string;
  phone?: string;

  role: USER_ROLE;
  branchId: string;
}

export interface UserDto {
  userId: string;
  email: string;
  role: USER_ROLE;
  name: string;

  branch: Branch | null;
}
