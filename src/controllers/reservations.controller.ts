import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Sync } from '../models/sync.model';
import { AdapterService } from '../services/adapter.service';

interface SetReservationBody {
  branchId: string;
  params: Sync;
}

export class ReservationsController {
  public static setReservation: ControllerHandler<boolean> = async (req, res) => {
    const { branchId, params }: Partial<SetReservationBody> = req.body;

    if (!branchId || !params) {
      throw ErrorResponse.InvalidParams();
    }

    delete params.reservation?.additionalInfo;

    await ReservationsDB.saveReservation(branchId, params);
    await AdapterService.getInstance().sendReservation(branchId, params);

    res.json(ApiResponse.success(true));
  };

  private static handleError = (functionName: string, error: any) => {
    const message = error instanceof Error ? error.message : JSON.stringify(error);

    console.log(`ERROR! function: ${functionName}, message: ${message}`);
  };
}
