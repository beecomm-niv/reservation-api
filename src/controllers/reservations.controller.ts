import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Order } from '../models/order.model';
import { Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { AdapterService } from '../services/adapter.service';
import { OntopoService } from '../services/ontopo.service';
import { RealTimeService } from '../services/realtime.service';

interface SetReservationBody {
  branchId: string;
  params: Sync;
}

interface MergeOrdersToReservationBody {
  branchName: string;
  externalBranchId: string;
  orders?: Order[];
}

interface SetPosReservationsBody {
  branchId: string;
  externalBranchId: string;
  orders?: Order[];
  removed?: number[];
  init?: boolean;
  branchName?: string;
}

export class ReservationsController {
  public static setReservation: ControllerHandler<null> = async (req, res) => {
    const { branchId, params }: SetReservationBody = req.body;

    if (!branchId || !params.syncId || !params.reservation?.table.length) {
      throw ErrorResponse.MissingRequiredParams();
    }

    if (params.reservation.status === 'seated') {
      const reservation = await ReservationsDB.setReservation(branchId, params, '');

      if (!params.order) {
        await AdapterService.getInstance().sendReservation(reservation);
      }
    }

    res.send(ApiResponse.success(null));
  };

  public static getReservation: ControllerHandler<Reservation> = async (req, res) => {
    const syncId = req.params.id;

    if (!syncId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const sync = await ReservationsDB.getReservation(syncId);

    res.send(ApiResponse.success(sync));
  };

  public static setPosReservations: ControllerHandler<null> = async (req, res) => {
    const { branchId, externalBranchId, init, removed, orders, branchName }: SetPosReservationsBody = req.body;

    if (!branchId || !orders || !externalBranchId || !removed || !branchName) {
      throw ErrorResponse.InvalidParams();
    }

    await RealTimeService.setReservations(branchId, orders, removed, init);

    if (!init && orders.length) {
      const ontopo = OntopoService.getInstance();

      const reservations = await ReservationsDB.getReservationsFromOrders(
        branchName,
        orders.filter((o) => !o.isRandom)
      );

      reservations.forEach((r) => ontopo.setReservation(externalBranchId, r));
      orders.filter((o) => o.isRandom).forEach((o) => ontopo.setRandomOrder(externalBranchId, o));
    }

    res.send(ApiResponse.success(null));
  };

  public static mergeOrdersToReservations: ControllerHandler<null> = async (req, res) => {
    const { branchName, orders, externalBranchId }: MergeOrdersToReservationBody = req.body;

    if (!branchName || !externalBranchId || !orders?.length) {
      throw ErrorResponse.InvalidParams();
    }

    const reservations = await ReservationsDB.getReservationsFromOrders(branchName, orders);
    await ReservationsDB.writeMultipleReservations(reservations);

    const ontopo = OntopoService.getInstance();

    reservations.forEach((r) => ontopo.setReservation(externalBranchId, r));

    res.send(ApiResponse.success(null));
  };
}
