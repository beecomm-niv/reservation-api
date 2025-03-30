import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { OrderDto } from '../models/order.model';
import { Sync } from '../models/sync.model';
import { AdapterService } from '../services/adapter.service';
import { OntopoService } from '../services/ontopo.service';
import { RealTimeService } from '../services/realtime.service';
import { SyncService } from '../services/sync.service';

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

    if (!branchId || !params || !params.reservation?.table.length) {
      throw ErrorResponse.InvalidParams();
    }

    const sendToPos = params.reservation.status === 'seated';

    if (sendToPos) {
      params.order = await AdapterService.getInstance().sendReservation(branchId, params);
    }

    ReservationsDB.saveReservationFromSync(branchId, params).catch((e) => this.handleError('ReservationsDB.saveReservationFromSync', e));
    RealTimeService.setReservations(branchId, [params]).catch((e) => this.handleError('RealTimeService.setReservations', e));

    if (sendToPos) {
      return res.send(ApiResponse.success(params));
    }

    res.send(ApiResponse.success(undefined));
  };

  public static posWatch: ControllerHandler<undefined> = async (req, res) => {
    const { branchId, externalBranchId, orders, init, finishedOrders }: WatchPosBody = req.body;

    if (!branchId || !externalBranchId || !orders) {
      throw ErrorResponse.InvalidParams();
    }

    const syncs = await ReservationsDB.getAndMergeSyncsFromOrders(orders.filter((o) => !o.isNew));

    ReservationsDB.saveMultiReservationsFromSyncs(branchId, syncs).catch((e) => this.handleError('ReservationsDB.saveMultiReservationsFromSyncs', e));

    const fullSyncs = SyncService.syncFromNewOrders(orders.filter((o) => o.isNew)).concat(syncs);

    if (!finishedOrders) {
      RealTimeService.setReservations(branchId, fullSyncs, init).catch((e) => this.handleError('RealTimeService.setReservations', e));
    }

    OntopoService.getInstance()
      .setReservations(externalBranchId, fullSyncs)
      .catch((e) => this.handleError('OntopoService.setReservations', e));

    res.send(ApiResponse.success(undefined));
  };

  private static handleError = (functionName: string, error: any) => {
    const message = error instanceof Error ? error.message : JSON.stringify(error);

    console.log(`ERROR! function: ${functionName}, message: ${message}`);
  };
}
