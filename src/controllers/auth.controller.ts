import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { ACCESS, USER_ROLE } from '../models/jwt-payload.model';
import { JwtService } from '../services/jwt.service';

export class AuthController {
  public static verify: (roles: USER_ROLE[], access: ACCESS) => ControllerHandler<null> = (roles: USER_ROLE[], access: ACCESS) => async (req, _, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const user = JwtService.verify(token);

    if (user) {
      const hasAccess = user.access.some((a) => a === '*' || a === access);
      const hasRoleAccess = user.role === 'super_admin' || roles.some((r) => r === user.role);

      if (hasAccess && hasRoleAccess) {
        req.user = user;
        next();

        return;
      }
    }

    throw ErrorResponse.AccessDenied();
  };
}
