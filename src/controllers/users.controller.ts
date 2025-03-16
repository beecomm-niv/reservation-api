import { Response } from 'express';
import { UsersDB } from '../db/users.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { User, UserDto } from '../models/user.model';
import { JwtService } from '../services/jwt.service';
import { Branch } from '../models/branch.model';
import { BranchesDB } from '../db/branches.db';

interface EmailAndPassword {
  email?: string;
  password?: string;
  name?: string;
}

export class UsersController {
  private static getBranchByUser = async (user: User): Promise<Branch | null> => {
    let branch: Branch | null = null;

    try {
      if (user.role === 'user' && user.branchId) {
        branch = await BranchesDB.getBranchById(user.branchId);
      }
    } catch {}

    return branch;
  };

  private static userToDto = (user: User, branch: Branch | null): UserDto => ({
    branch,
    email: user.email,
    name: user.name,
    role: user.role,
    userId: user.userId,
  });

  private static setTokenInHeader = (user: User, res: Response) => {
    const token = JwtService.sign({
      access: ['*'],
      id: user.userId,
      role: user.role,
    });

    const HEADER_NAME = 'x-auth-token';

    res.setHeader(HEADER_NAME, token);
    res.setHeader('Access-Control-Expose-Headers', HEADER_NAME);
  };

  public static createUser: ControllerHandler<UserDto> = async (req, res) => {
    const { email, name, password }: EmailAndPassword = req.body;

    if (!email || !password || !name) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const user = await UsersDB.createUser(email, password, name);

    res.send(ApiResponse.success(this.userToDto(user, null)));
  };

  public static getUserByEmailAndPassword: ControllerHandler<UserDto> = async (req, res) => {
    const body: EmailAndPassword = req.body;

    if (!body.email || !body.password) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const user = await UsersDB.getUserByEmailAndPassword(body.email, body.password);
    const branch = await this.getBranchByUser(user);

    this.setTokenInHeader(user, res);

    res.send(ApiResponse.success(this.userToDto(user, branch)));
  };

  public static getUserFromToken: ControllerHandler<UserDto> = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      throw ErrorResponse.AccessDenied();
    }

    const user = await UsersDB.getUserById(userId);
    const branch = await this.getBranchByUser(user);

    res.send(ApiResponse.success(this.userToDto(user, branch)));
  };

  public static updateUser: ControllerHandler<null> = async (req, res) => {
    const body: Partial<User> = req.body;

    if (!body.userId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    await UsersDB.updateUser(body.userId, body);

    res.send(ApiResponse.success(null));
  };
}
