import { UsersDB } from '../db/users.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { User, UserDto } from '../models/user.model';
import { UsersService } from '../services/users.service';

interface CreateUserBody {
  email?: string;
  password?: string;
  name?: string;
}

interface GetUserBody {
  email?: string;
  password?: string;
}

export class UsersController {
  public static createUser: ControllerHandler<UserDto> = async (req, res) => {
    const { email, name, password }: CreateUserBody = req.body;

    if (!email || !password || !name) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const user = await UsersDB.createUser(email, password, name);

    return res.json(ApiResponse.success(UsersService.userToDto(user, null)));
  };

  public static getUserByEmailAndPassword: ControllerHandler<UserDto> = async (req, res) => {
    const { email, password }: GetUserBody = req.body;

    if (!email || !password) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const user = await UsersDB.getUserByEmailAndPassword(email, password);
    const branch = await UsersService.getBranchByUser(user);

    UsersService.setTokenInHeader(user, res);

    return res.json(ApiResponse.success(UsersService.userToDto(user, branch)));
  };

  public static getUserFromToken: ControllerHandler<UserDto> = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      throw ErrorResponse.AccessDenied();
    }

    const user = await UsersDB.getUserById(userId);
    const branch = await UsersService.getBranchByUser(user);

    return res.json(ApiResponse.success(UsersService.userToDto(user, branch)));
  };

  public static updateUser: ControllerHandler<null> = async (req, res) => {
    const body: Partial<User> = req.body;

    if (!body.userId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    await UsersDB.updateUser(body.userId, body);

    return res.json(ApiResponse.success(null));
  };
}
