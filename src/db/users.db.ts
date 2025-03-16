import { ErrorResponse } from '../models/error-response.model';
import { User } from '../models/user.model';
import { DB } from './db';

import crypto from 'crypto';
import bycrypt from 'bcryptjs';

export class UsersDB {
  private static readonly TABLE_NAME = 'users';

  public static getUserById = async (userId: string): Promise<User> => {
    const user = await DB.getInstance().findItemByKey<User>(UsersDB.TABLE_NAME, { userId });

    return user;
  };

  public static createUser = async (requestedEmail: string, requestedPassword: string, name: string): Promise<User> => {
    const email = requestedEmail.toLowerCase();

    const userId = crypto.createHash('sha1').update(email).digest('hex');
    const password = await bycrypt.hash(requestedPassword, 10);

    const user: User = {
      userId,
      email,
      password,
      name,
      branchId: '',
      role: 'user',
    };

    try {
      await DB.getInstance().setItemByKey(UsersDB.TABLE_NAME, user, {
        deniedOverride: true,
        primaryKey: 'userId',
      });
    } catch {
      throw ErrorResponse.EmailAlradyExist();
    }

    return user;
  };

  public static getUserByEmailAndPassword = async (requestedEmail: string, requestedPassword: string): Promise<User> => {
    const email = requestedEmail.toLowerCase();

    const response = await DB.getInstance().query<User>(this.TABLE_NAME, 'email-index', [{ alias: ':e', expression: 'email', value: email }]);

    if (!response.Items?.length) {
      throw ErrorResponse.BadEmailOrPassword();
    }

    const user = response.Items[0] as User;

    const isPasswordMatch = await bycrypt.compare(requestedPassword, user.password);
    if (!isPasswordMatch) {
      throw ErrorResponse.BadEmailOrPassword();
    }

    return user;
  };

  public static updateUser = async (userId: string, user: Partial<User>) => {
    await DB.getInstance().update<User>(this.TABLE_NAME, 'userId', userId, [
      { alias: ':n', expression: 'name', value: user.name },
      { alias: ':b', expression: 'branchId', value: user.branchId },
    ]);
  };
}
