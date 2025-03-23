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
  init: boolean;
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

    res.send(ApiResponse.success(undefined));
  };

  public static posWatch: ControllerHandler<undefined> = async (req, res) => {
    const { branchId, externalBranchId, orders, init }: WatchPosBody = req.body;

    if (!branchId || !externalBranchId || !orders) {
      throw ErrorResponse.InvalidParams();
    }

    RealTimeService.setOrders(branchId, orders, init);

    if (!init && orders.length) {
      const activeOrders = orders.filter((o) => !o.isNew);
      const newOrders = orders.filter((o) => o.isNew);

      const reservations = await ReservationsDB.getReservations(activeOrders.map((o) => o.syncId));

      ReservationsDB.mergeAndSaveOrders(reservations, activeOrders);
      OntopoService.getInstance().setOrders(externalBranchId, reservations, activeOrders, newOrders);
    }

    res.send(ApiResponse.success(undefined));
  };
}
