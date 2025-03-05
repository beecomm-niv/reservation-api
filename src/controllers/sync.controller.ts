import { ReservationsDB, SyncQureyRequest } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Sync } from '../models/sync.model';

export class SyncController {
  public static setSync: ControllerHandler<null> = async (req, res) => {
    const body: Sync = req.body;

    if (!body.branchId || !body.params.syncId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const service = new ReservationsDB();
    await service.setReservation(body);

    res.send(ApiResponse.success(null));
  };

  public static getSync: ControllerHandler<Sync> = async (req, res) => {
    const syncId = req.params.id;

    if (!syncId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const service = new ReservationsDB();
    const sync = await service.getSync(syncId);

    if (!sync) {
      throw ErrorResponse.MissingSync();
    }

    res.send(ApiResponse.success(sync));
  };

  public static querySync: ControllerHandler<Sync[]> = async (req, res) => {
    const body: SyncQureyRequest = req.body;

    if (!body.branchId && !body.clientPhone) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const service = new ReservationsDB();
    const response = await service.querySync(body);

    res.send(ApiResponse.success(response));
  };
}
