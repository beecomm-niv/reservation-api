import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Reservation } from '../models/Reservation.model';
import { Sync } from '../models/sync.model';
import { DB } from '../services/db.service';

export class SyncController {
  public static handleSync: ControllerHandler<null> = async (req, res) => {
    const body: Sync = req.body;

    if (!body.branchId || !body.params.syncId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const db = DB.getInstance();
    const reservation: Reservation = {
      branchId: body.branchId,
      branchName: 'בדיקה',
      clientName: body.params.reservation.patron.name,
      clientPhone: body.params.reservation.patron.phone,
      syncId: body.params.syncId,
      sync: body,
    };

    await db
      .put({
        TableName: 'reservations',
        Item: reservation,
      })
      .promise();

    res.send(ApiResponse.success(null));
  };
}
