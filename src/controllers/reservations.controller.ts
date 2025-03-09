import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Order } from '../models/order.model';
import { Reservation } from '../models/reservation';
import { Sync } from '../models/sync.model';

interface SetOrderBody {
  syncId: string;
  branchName: string;
  order: Order;
}

interface QueryByPhoneBody {
  clientPhone: string;
  branchId: string;
  fetchFull: boolean;
}

interface QueryByBranch {
  branchId: string;
}

export class ReservationsController {
  public static setReservation: ControllerHandler<null> = async (req, res) => {
    const body: Sync = req.body;

    if (!body.branchId || !body.params.syncId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    // TODO: for now we only handled seated reservations from external service host system. we handle all statuses once we have our host system.
    if (body.params.reservation.status === 'seated') {
      await ReservationsDB.setReservation(body, '');
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

  public static queryReservationsByClientPhone: ControllerHandler<Reservation[]> = async (req, res) => {
    const body: QueryByPhoneBody = req.body;

    if (!body.clientPhone) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const data = await ReservationsDB.queryReservationsByClientPhone(body.fetchFull, body.clientPhone, body.branchId);

    res.send(ApiResponse.success(data));
  };

  public static queryReservationsByBranch: ControllerHandler<Reservation[]> = async (req, res) => {
    const body: QueryByBranch = req.body;

    if (!body.branchId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const data = await ReservationsDB.queryReservationsByBranch(body.branchId);

    return res.send(ApiResponse.success(data));
  };

  public static setOrderToReservation: ControllerHandler<null> = async (req, res) => {
    const body: SetOrderBody = req.body;

    if (!body.syncId || !body.branchName || !body.order) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const reservation = await ReservationsDB.getReservation(body.syncId);

    const sync: Sync = { ...reservation.sync };
    sync.params.order = body.order;

    await ReservationsDB.setReservation(sync, body.branchName);

    // TODO: send reservation to hosting service

    res.send(ApiResponse.success(null));
  };
}
