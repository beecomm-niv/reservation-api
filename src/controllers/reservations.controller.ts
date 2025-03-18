import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Order } from '../models/order.model';
import { Reservation, ReservationDto } from '../models/reservation';
import { SyncDto } from '../models/sync.model';
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
    const { branchId, params, externalBranchId }: SyncDto = req.body;

    if (!branchId || !params.syncId || !params.reservation?.table.length) {
      throw ErrorResponse.MissingRequiredParams();
    }

    if (params.reservation.status === 'seated') {
      const reservation = await ReservationsDB.setReservation(branchId, params, '');
      await AdapterService.getInstance().sendReservation(reservation);

      if (req.user?.role === 'user' && externalBranchId) {
        OntopoService.getInstance().setReservation(externalBranchId, params);
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
      const convertedReservations = await ReservationsDB.setReservationsFromPos(branchId, reservations);
      const ontopo = OntopoService.getInstance();

      convertedReservations.forEach((r) => ontopo.setReservation(externalBranchId, { syncAt: r.syncAt, syncId: r.syncId, order: r.order, reservation: r.reservation }));
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

    result.forEach((r) => ontopo.setReservation(externalBranchId, { syncAt: r.syncAt, syncId: r.syncId, order: r.order, reservation: r.reservation }));

    res.send(ApiResponse.success(null));
  };
}
