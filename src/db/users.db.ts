import { ErrorResponse } from '../models/error-response.model';
import { User, UserDto } from '../models/user.model';
import { DB } from './db';

import crypto from 'crypto';
import bycrypt from 'bcryptjs';

export class UsersDB {
  private static readonly TABLE_NAME = 'users';

  private static userToDto = (user: User): UserDto => ({
    branch: null, // TODO
    email: user.email,
    role: user.role,
    userId: user.userId,
    name: user.name,
  });

  public static getUserById = async (userId: string): Promise<UserDto> => {
    const user = await DB.getInstance().findItemByKey<User>(UsersDB.TABLE_NAME, { userId });

    return this.userToDto(user);
  };

  public static createUser = async (requestedEmail: string, requestedPassword: string, name: string): Promise<UserDto> => {
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

    return this.userToDto(user);
  };

  public static getUserByEmailAndPassword = async (requestedEmail: string, requestedPassword: string): Promise<UserDto> => {
    const email = requestedEmail.toLowerCase();

    const response = await DB.getInstance()
      .client.query({
        TableName: UsersDB.TABLE_NAME,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :e',
        ExpressionAttributeValues: {
          ':e': email,
        },
      })
      .promise();

    if (!response.Items?.length) {
      throw ErrorResponse.BadEmailOrPassword();
    }

    const user = response.Items[0] as User;

    const isPasswordMatch = await bycrypt.compare(requestedPassword, user.password);
    if (!isPasswordMatch) {
      throw ErrorResponse.BadEmailOrPassword();
    }

    return this.userToDto(user);
  };
}
