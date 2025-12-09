import { ServicesDB } from '../db/services.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { ACCESS } from '../models/jwt-payload.model';
import { Service } from '../models/service.model';
import { JwtService } from '../services/jwt.service';

interface CreateServiceBody {
  name: string;
  access: ACCESS[];
}

interface GetTokenBody {
  accessKeyId?: string;
  accessSecretKey?: string;
}

export class ServiceController {
  public static createService: ControllerHandler<null> = async (req, res) => {
    const { access, name }: CreateServiceBody = req.body;

    if (!access || !name) {
      throw ErrorResponse.MissingRequiredParams();
    }

    await ServicesDB.createService(name, access);

    return res.json(ApiResponse.success(null));
  };

  public static getToken: ControllerHandler<string> = async (req, res) => {
    const { accessKeyId, accessSecretKey }: GetTokenBody = req.body;

    if (!accessKeyId || !accessSecretKey) {
      throw ErrorResponse.SignatureDoesNotMatch();
    }

    const service = await ServicesDB.findServiceByKeyAndSecret(accessKeyId, accessSecretKey);
    const token = JwtService.sign({ access: service.access, id: service.id, role: 'service' });

    return res.json(ApiResponse.success(token));
  };

  public static updateService: ControllerHandler<null> = async (req, res) => {
    const body: Partial<Service> = req.body;

    if (!body.id) {
      throw ErrorResponse.MissingRequiredParams();
    }

    await ServicesDB.updateService(body.id, body);

    return res.json(ApiResponse.success(null));
  };
}
