import { ServicesDB } from '../db/services.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { JwtService } from '../services/jwt.service';

interface CreateServiceBody {
  name: string;
  access: string[];
}

interface GetTokenBody {
  accessKeyId?: string;
  accessSecretKey?: string;
}

export class ServiceController {
  public static createService: ControllerHandler<null> = async (req, res) => {
    const body: CreateServiceBody = req.body;

    if (!body.access || !body.name) {
      throw ErrorResponse.MissingRequiredParams();
    }

    await ServicesDB.createService(body.name, body.access);

    res.send(ApiResponse.success(null));
  };

  public static getToken: ControllerHandler<string> = async (req, res) => {
    const body: GetTokenBody = req.body;

    if (!body.accessKeyId || !body.accessSecretKey) {
      throw ErrorResponse.SignatureDoesNotMatch();
    }

    const service = await ServicesDB.findServiceByKeyAndSecret(body.accessKeyId, body.accessSecretKey);
    const token = JwtService.sign({ access: service.access, user: service.name });

    res.send(ApiResponse.success(token));
  };
}
