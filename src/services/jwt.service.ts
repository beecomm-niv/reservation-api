import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../models/error-response.model';
import { JwtPayload } from '../models/jwt-payload.model';

export class JwtService {
  private static SECRET = process.env.JWT_SECRET;

  public static sign = (payload: JwtPayload) => {
    if (!this.SECRET) {
      throw ErrorResponse.AuthorizationError();
    }

    return jwt.sign(payload, this.SECRET, { expiresIn: '2d' });
  };

  public static verify = (token: string): JwtPayload | null => {
    if (!this.SECRET) {
      throw ErrorResponse.AuthorizationError();
    }

    return jwt.verify(token, this.SECRET) as JwtPayload;
  };
}
