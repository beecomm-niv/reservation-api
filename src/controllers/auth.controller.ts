import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { ACCESS, USER_ROLE } from '../models/jwt-payload.model';
import { JwtService } from '../services/jwt.service';

export class AuthController {
  public static verify: (roles: USER_ROLE[], access: ACCESS) => ControllerHandler<null> = (roles: USER_ROLE[], access: ACCESS) => async (req, _, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const payload = JwtService.verify(token);

    if (payload) {
      const hasAccess = payload.access.some((a) => a === '*' || a === access);
      const hasRoleAccess = payload.role === 'super_admin' || roles.some((r) => r === payload.role);

      if (hasAccess && hasRoleAccess) {
        req.user = payload;
        next();

        return;
      }
    }

    throw ErrorResponse.AccessDenied();
  };
}
