import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../models/error-response.model';
import { JwtPayload } from '../models/jwt-payload.model';

export class JwtService {
  public static sign = (payload: JwtPayload) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw ErrorResponse.AuthorizationError();
    }

    return jwt.sign(payload, secret, { expiresIn: '2d' });
  };

  public static verify = (token: string): JwtPayload | null => {
    try {
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw ErrorResponse.AuthorizationError();
      }

      const response = jwt.verify(token, secret);

      return response as JwtPayload;
    } catch {
      return null;
    }
  };
}
