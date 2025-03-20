import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { OrderDto } from '../models/order.model';
import { Sync } from '../models/sync.model';
import { AdapterService } from '../services/adapter.service';
import { OntopoService } from '../services/ontopo.service';
import { RealTimeService } from '../services/realtime.service';

interface SetReservationBody {
  branchId: string;
  params: Sync;
}

interface WatchPosBody {
  branchId: string;
  externalBranchId: string;

  orders: OrderDto[];
  removed: number[];
  init: boolean;
}

interface FinishOrdersBody {
  branchId: string;
  externalBranchId: string;

  orders: OrderDto[];
}

export class ReservationsController {
  public static setReservation: ControllerHandler<undefined> = async (req, res) => {
    const { branchId, params }: Partial<SetReservationBody> = req.body;

    if (!branchId || !params || !params.reservation?.table.length) {
      throw ErrorResponse.InvalidParams();
    }

    const reservation = await ReservationsDB.saveReservationFromSync(branchId, params);

    if (reservation.reservation?.status === 'seated') {
      AdapterService.getInstance().sendReservation(branchId, reservation);
    }

    res.send(ApiResponse.success(undefined));
  };

  public static posWatch: ControllerHandler<undefined> = async (req, res) => {
    const { branchId, externalBranchId, init, orders, removed }: Partial<WatchPosBody> = req.body;

    if (!branchId || !externalBranchId || !orders || !removed) {
      throw ErrorResponse.InvalidParams();
    }

    await RealTimeService.setOrders(branchId, orders, removed, Boolean(init));

    if (!init && orders.length) {
      const reservations = await ReservationsDB.getReservations(orders.map((o) => o.syncId));
      OntopoService.getInstance().setOrders(externalBranchId, reservations, orders);
    }

    res.send(ApiResponse.success(undefined));
  };

  public static finishPosOrders: ControllerHandler<undefined> = async (req, res) => {
    const { branchId, externalBranchId, orders }: FinishOrdersBody = req.body;

    if (!branchId || !externalBranchId || !orders.length) {
      throw ErrorResponse.InvalidParams();
    }

    const reservations = await ReservationsDB.getReservations(orders.map((o) => o.syncId));

    await ReservationsDB.finishOrders(reservations, orders);
    OntopoService.getInstance().setOrders(externalBranchId, reservations, orders);

    res.send(ApiResponse.success(undefined));
  };
}
