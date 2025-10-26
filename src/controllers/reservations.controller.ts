import { ControllerHandler } from '../models/controller-handler.model';
import { OrderDto } from '../models/order.model';
import { Sync } from '../models/sync.model';

interface SetReservationBody {
  branchId: string;
  params: Sync;
}

interface WatchPosBody {
  branchId: string;
  externalBranchId: string;

  orders: OrderDto[];
  init: boolean;
  finishedOrders: boolean;
}

export class ReservationsController {
  public static setReservation: ControllerHandler<Sync | undefined> = async (req, res) => {
    const { branchId, params }: Partial<SetReservationBody> = req.body;
  };

  public static posWatch: ControllerHandler<undefined> = async (req, res) => {
    const { branchId, externalBranchId, orders, init, finishedOrders }: WatchPosBody = req.body;
  };

  private static handleError = (functionName: string, error: any) => {
    const message = error instanceof Error ? error.message : JSON.stringify(error);

    console.log(`ERROR! function: ${functionName}, message: ${message}`);
  };
}
