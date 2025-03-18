import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Order } from '../models/order.model';
import { Reservation, ReservationDto } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { AdapterService } from '../services/adapter.service';
import { OntopoService } from '../services/ontopo.service';
import { RealTimeService } from '../services/realtime.service';

interface MergeOrdersToReservationBody {
  branchName: string;
  externalBranchId: string;
  orders?: Order[];
}

interface SetPosReservationsBody {
  branchId: string;
  externalBranchId: string;
  reservations?: ReservationDto[];
  removed?: number[];
  init?: boolean;
}

export class ReservationsController {
  public static setReservation: ControllerHandler<null> = async (req, res) => {
    const body: Sync = req.body;

    if (!body.branchId || !body.params.syncId || !body.params.reservation?.table.length) {
      throw ErrorResponse.MissingRequiredParams();
    }

    if (body.params.reservation.status === 'seated') {
      const reservation = await ReservationsDB.setReservation(body, '');
      await AdapterService.getInstance().sendReservation(reservation);

      if (req.user?.role === 'user' && body.externalBranchId) {
        OntopoService.getInstance().setReservation(body.params, body.externalBranchId);
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
    const { branchId, externalBranchId, init, removed, reservations }: SetPosReservationsBody = req.body;

    if (!branchId || !reservations || !externalBranchId || !removed) {
      throw ErrorResponse.InvalidParams();
    }

    const newReservations = reservations.filter((r) => r.isNew);

    if (newReservations.length) {
      const syncs = await ReservationsDB.setReservationsFromPos(branchId, reservations);
      const ontopo = OntopoService.getInstance();

      syncs.forEach((s) => ontopo.setReservation(s.sync.params, externalBranchId));
    }

    if (reservations.length || removed.length || init) {
      await RealTimeService.setReservations(branchId, reservations, removed, !!init);
    }

    res.send(ApiResponse.success(null));
  };

  public static mergeOrdersToReservations: ControllerHandler<null> = async (req, res) => {
    const { branchName, orders, externalBranchId }: MergeOrdersToReservationBody = req.body;

    if (!branchName || !externalBranchId || !orders?.length) {
      throw ErrorResponse.InvalidParams();
    }

    const result = await ReservationsDB.mergeOrdersToReservations(branchName, orders);
    const ontopo = OntopoService.getInstance();

    result.forEach((r) => ontopo.setReservation(r.params, externalBranchId));

    res.send(ApiResponse.success(null));
  };
}
