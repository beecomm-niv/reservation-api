import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Sync } from '../models/sync.model';

export class SyncController {
  public static handleSync: ControllerHandler<Sync> = (req, res) => {
    const body: Sync = req.body;

    if (!body.branchId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    res.send(ApiResponse.success(body));
  };
}
