import { Response } from 'express';
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
  private static setTokenInHeader = (user: User, res: Response) => {
    const token = JwtService.sign({
      access: ['*'],
      id: user.userId,
      role: user.role,
    });

    res.setHeader('x-auth-token', token);
    res.setHeader('Access-Control-Expose-Headers', 'x-auth-token');
  };

  public static createUser: ControllerHandler<User> = async (req, res) => {
    const body: EmailAndPassword = req.body;

    if (!body.email || !body.password) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const user = await UsersDB.createUser(body.email, body.password);

    res.send(ApiResponse.success(user));
  };

  public static getUserByEmailAndPassword: ControllerHandler<User> = async (req, res) => {
    const body: EmailAndPassword = req.body;

    if (!body.email || !body.password) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const user = await UsersDB.getUserByEmailAndPassword(body.email, body.password);
    this.setTokenInHeader(user, res);

    res.send(ApiResponse.success(user));
  };

  public static getUserFromToken: ControllerHandler<User> = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      throw ErrorResponse.AccessDenied();
    }

    const user = await UsersDB.getUserById(userId);

    res.send(ApiResponse.success(user));
  };
}
