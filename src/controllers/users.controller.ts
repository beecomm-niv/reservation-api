import { UsersDB } from '../db/users.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { User } from '../models/user.model';
import { JwtService } from '../services/jwt.service';

interface EmailAndPassword {
  email?: string;
  password?: string;
}

export class UsersController {
  private static getTokenFromUser = (user: User) =>
    JwtService.sign({
      access: ['*'],
      id: user.userId,
      role: user.role,
    });

  public static createUser: ControllerHandler<User> = async (req, res) => {
    const body: EmailAndPassword = req.body;

    if (!body.email || !body.password) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const user = await UsersDB.createUser(body.email, body.password);
    res.setHeader('x-auth-token', this.getTokenFromUser(user));

    res.send(ApiResponse.success(user));
  };

  public static getUserByEmailAndPassword: ControllerHandler<User> = async (req, res) => {
    const body: EmailAndPassword = req.body;

    if (!body.email || !body.password) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const user = await UsersDB.getUserByEmailAndPassword(body.email, body.password);
    res.setHeader('x-auth-token', this.getTokenFromUser(user));

    res.send(ApiResponse.success(user));
  };

  public static getTokenFromToken: ControllerHandler<User> = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      throw ErrorResponse.AccessDenied();
    }

    const user = await UsersDB.getUserById(userId);

    res.send(ApiResponse.success(user));
  };
}
