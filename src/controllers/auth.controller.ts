import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { ACCESS, JwtPayload, USER_ROLE } from '../models/jwt-payload.model';
import { JwtService } from '../services/jwt.service';

export class AuthController {
  private static USER_POWER: Record<USER_ROLE, number> = {
    service: 10,
    user: 20,
    admin: 30,
    super_admin: 40,
  };

  public static verify: {
    (role: USER_ROLE, withServiceAccess: true, access: ACCESS): ControllerHandler<null>;
    (role: USER_ROLE, withServiceAccess: false): ControllerHandler<null>;
  } = (role: USER_ROLE, withServiceAccess: boolean, access?: ACCESS) => async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const payload = JwtService.verify(token || '');

    if (!payload) {
      throw ErrorResponse.AccessDenied();
    }

    const hasAccess = this.isHaveAccess(payload, role, withServiceAccess, access);

    if (hasAccess) {
      req.user = payload;
      next();
    } else {
      throw ErrorResponse.AccessDenied();
    }
  };

  private static isHaveAccess = (user: JwtPayload, role: USER_ROLE, withServiceAccess: boolean, access?: ACCESS): boolean => {
    switch (user.role) {
      case 'service':
        return withServiceAccess && user.access.some((a) => a === '*' || a === access);
      default:
        return (this.USER_POWER[user.role] || -1) >= (this.USER_POWER[role] || 99);
    }
  };
}
