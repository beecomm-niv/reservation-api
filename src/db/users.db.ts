import { ErrorResponse } from '../models/error-response.model';
import { User } from '../models/user.model';
import { DB } from './db';

import { subtle } from 'crypto';

export class UsersDB {
  private static readonly TABLE_NAME = 'users';

  private static digest = async (value: string, type: 'SHA-256' | 'SHA-1') => {
    const hashBuffer = await subtle.digest(type, Buffer.from(value));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  };

  public static getUserById = async (userId: string) => {
    const user = await DB.getInstance().findItemByKey<User>(UsersDB.TABLE_NAME, { userId });
    delete user.password;

    return user;
  };

  public static createUser = async (requestedEmail: string, requestedPassword: string): Promise<User> => {
    const email = requestedEmail.toLowerCase();

    const userId = await UsersDB.digest(email, 'SHA-1');
    const password = await UsersDB.digest(requestedPassword, 'SHA-256');

    const user: User = {
      userId,
      email,
      password,
      beeBranchId: '',
      hostBranchId: '',
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

    delete user.password;

    return user;
  };

  public static getUserByEmailAndPassword = async (requestedEmail: string, requestedPassword: string): Promise<User> => {
    const email = requestedEmail.toLowerCase();
    const password = await UsersDB.digest(requestedPassword, 'SHA-256');

    const response = await DB.getInstance()
      .client.query({
        TableName: UsersDB.TABLE_NAME,
        IndexName: 'email-password-index',
        KeyConditionExpression: 'email = :e And password = :p',
        ExpressionAttributeValues: {
          ':e': email,
          ':p': password,
        },
      })
      .promise();

    if (!response.Items?.length) {
      throw ErrorResponse.BadEmailOrPassword();
    }

    const user = response.Items[0] as User;
    delete user.password;

    return user;
  };
}
