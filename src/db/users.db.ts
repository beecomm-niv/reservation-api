import { ErrorResponse } from '../models/error-response.model';
import { User } from '../models/user.model';
import { DB } from './db';

import { subtle } from 'crypto';

export class UsersDB {
  private static readonly TABLE_NAME = 'users';

  private static sha256 = async (value: string) => {
    const hashBuffer = await subtle.digest('SHA-256', Buffer.from(value));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  };

  public static getUserById = async (userId: string) => {
    const user = await DB.getInstance().findItemByKey<User>(UsersDB.TABLE_NAME, { userId });
    delete user.password;

    return user;
  };

  public static createUser = async (email: string, password: string): Promise<User> => {
    const userId = await UsersDB.sha256(email);
    const hashPassword = await UsersDB.sha256(password);

    const user: User = {
      userId,
      email: email.toLowerCase(),
      password: hashPassword,
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

  public static getUserByEmailAndPassword = async (email: string, password: string): Promise<User> => {
    const hashPassword = await UsersDB.sha256(password);

    const response = await DB.getInstance()
      .client.query({
        TableName: UsersDB.TABLE_NAME,
        IndexName: 'email-password-index',
        KeyConditionExpression: 'email = :e And password = :p',
        ExpressionAttributeValues: {
          ':e': email.toLowerCase(),
          ':p': hashPassword,
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
