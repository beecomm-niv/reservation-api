import { Response } from 'express';
import { BranchesDB } from '../db/branches.db';
import { Branch } from '../models/branch.model';
import { User, UserDto } from '../models/user.model';
import { JwtService } from './jwt.service';

export class UsersService {
  public static getBranchByUser = async (user: User): Promise<Branch | null> => {
    let branch: Branch | null = null;

    try {
      if (user.role === 'user' && user.branchId) {
        branch = await BranchesDB.getBranchById(user.branchId);
      }
    } catch {}

    return branch;
  };

  public static userToDto = (user: User, branch: Branch | null): UserDto => ({
    branch,
    email: user.email,
    name: user.name,
    role: user.role,
    userId: user.userId,
  });

  public static setTokenInHeader = (user: User, res: Response) => {
    const token = JwtService.sign({
      access: ['*'],
      id: user.userId,
      role: user.role,
    });

    const HEADER_NAME = 'x-auth-token';

    res.setHeader(HEADER_NAME, token);
    res.setHeader('Access-Control-Expose-Headers', HEADER_NAME);
  };
}
