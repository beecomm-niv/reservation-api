import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { JwtService } from '../services/jwt.service';

export class AuthController {
  public static verify: (access: string) => ControllerHandler<null> = (access) => async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    const payload = JwtService.verify(token || '');

    if (!token || !payload?.access.some((a) => a === '*' || a === access)) {
      res.status(401).send(ApiResponse.error(401, 'Access denied'));
      return;
    }

    next();
  };
}
