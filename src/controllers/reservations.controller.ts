import dayjs from 'dayjs';
import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Order } from '../models/order.model';
import { Sync } from '../models/sync.model';
import { AdapterService } from '../services/adapter.service';
import { OntopoService } from '../services/ontopo.service';
import { ReservationsService } from '../services/reservations.service';

interface SetReservationBody {
  branchId: string;
  params: Sync;
}

interface PosWatchBody {
  externalBranchId: string;
  orders: Order[];
}

export class ReservationsController {
  public static setReservation: ControllerHandler<null> = async (req, res) => {
    const { branchId, params }: Partial<SetReservationBody> = req.body;

    if (!branchId || !params) {
      throw ErrorResponse.InvalidParams();
    }

    req.log = { id: params.syncId, user: req.user?.id || 'unknown', payload: { branchId: branchId }, message: '', ts: dayjs().valueOf() };

    await ReservationsDB.saveReservation(branchId, params);
    await AdapterService.getInstance().sendReservation(branchId, params);

    res.json(ApiResponse.success(null));
  };

  public static posWatch: ControllerHandler<null> = async (req, res) => {
    const { externalBranchId, orders }: Partial<PosWatchBody> = req.body;

    if (!externalBranchId || !orders?.length) {
      throw ErrorResponse.InvalidParams();
    }

    const reservations = await ReservationsDB.fetchAndMergeReservationsWithOrders(orders.filter((o) => !o.isVisitor));

    await ReservationsDB.saveMultiReservations(reservations);

    const syncs: Sync[] = reservations.map(ReservationsService.convertReservationToSync).concat(orders.filter((o) => o.isVisitor).map(ReservationsService.convertOrderToSync));

    OntopoService.getInstance()
      .setReservations(externalBranchId, syncs)
      .catch(() => {});

    res.json(ApiResponse.success(null));
  };
}
