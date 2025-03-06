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

export class SyncController {
  public static setReservation: ControllerHandler<null> = async (req, res) => {
    const body: Sync = req.body;

    if (!body.branchId || !body.params.syncId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const service = new ReservationsDB();
    await service.setReservation(body, '');

    res.send(ApiResponse.success(null));
  };

  public static getReservation: ControllerHandler<Reservation> = async (req, res) => {
    const syncId = req.params.id;

    if (!syncId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const service = new ReservationsDB();
    const sync = await service.getReservation(syncId);

    res.send(ApiResponse.success(sync));
  };

  public static queryReservations: ControllerHandler<Reservation[]> = async (req, res) => {
    const { clientPhone, branchId, full } = req.query;

    if (!clientPhone) {
      throw ErrorResponse.MissingRequiredParams();
    }

    if (typeof clientPhone !== 'string') {
      throw ErrorResponse.InvalidParams();
    }

    const service = new ReservationsDB();
    const data = await service.queryReservations(full === 'true', clientPhone, typeof branchId === 'string' ? branchId : undefined);

    res.send(ApiResponse.success(data));
  };

  public static setOrderToReservation: ControllerHandler<null> = async (req, res) => {
    const body: SetOrderBody = req.body;

    if (!body.syncId || !body.branchName || !body.order) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const service = new ReservationsDB();
    const reservation = await service.getReservation(body.syncId);

    const sync: Sync = { ...reservation.sync };
    sync.params.order = body.order;

    await service.setReservation(sync, body.branchName);

    //TODO: send reservation to hosting service

    res.send(ApiResponse.success(null));
  };
}
