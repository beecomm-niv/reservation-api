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
  public static setReservation: ControllerHandler<undefined> = async (req, res) => {
    const { branchId, params }: Partial<SetReservationBody> = req.body;

    if (!branchId || !params || !params.reservation?.table.length) {
      throw ErrorResponse.InvalidParams();
    }

    const reservation = await ReservationsDB.saveReservationFromSync(branchId, params);

    if (reservation.reservation?.status === 'seated') {
      await AdapterService.getInstance().sendReservation(reservation);
    }

    RealTimeService.setReservations(branchId, [params]).catch(() => {});

    res.send(ApiResponse.success(undefined));
  };

  public static posWatch: ControllerHandler<undefined> = async (req, res) => {
    const { branchId, externalBranchId, orders, init, finishedOrders }: WatchPosBody = req.body;

    if (!branchId || !externalBranchId || !orders) {
      throw ErrorResponse.InvalidParams();
    }

    const syncs = await ReservationsDB.getAndMergeSyncsFromOrders(orders.filter((o) => !o.isNew));

    ReservationsDB.saveMultiReservationsFromSyncs(branchId, syncs).catch(() => {});

    const fullSyncs = SyncService.syncFromNewOrders(orders.filter((o) => o.isNew)).concat(syncs);

    if (!finishedOrders) {
      RealTimeService.setReservations(branchId, fullSyncs, init).catch(() => {});
    }

    OntopoService.getInstance()
      .setReservations(externalBranchId, fullSyncs)
      .catch(() => {});

    res.send(ApiResponse.success(undefined));
  };
}
