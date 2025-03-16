import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Order } from '../models/order.model';
import { Reservation, ReservationDto } from '../models/reservation';
import { Sync } from '../models/sync.model';
import { AdapterService } from '../services/adapter.service';
import { RealTimeService } from '../services/realtime.service';

interface MergeOrdersToReservationBody {
  branchName: string;
  orders?: Order[];
}

// interface QueryByPhoneBody {
//   clientPhone: string;
//   branchId: string;
//   fetchFull: boolean;
// }

// interface QueryByBranch {
//   branchId: string;
// }

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

    if (!body.branchId || !body.params.syncId || !body.params.reservation.table.length) {
      throw ErrorResponse.MissingRequiredParams();
    }

    // TODO: for now we only handled seated reservations from external service host system. we handle all statuses once we have our host system.
    if (body.params.reservation.status === 'seated') {
      const reservation = await ReservationsDB.setReservation(body, '');
      await AdapterService.getInstance().sendReservation(reservation);

      if (req.user?.role === 'user') {
        // TODO: update external reservations service.
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

  // public static queryReservationsByClientPhone: ControllerHandler<Reservation[]> = async (req, res) => {
  //   const body: QueryByPhoneBody = req.body;

  //   if (!body.clientPhone) {
  //     throw ErrorResponse.MissingRequiredParams();
  //   }

  //   const data = await ReservationsDB.queryReservationsByClientPhone(body.fetchFull, body.clientPhone, body.branchId);

  //   res.send(ApiResponse.success(data));
  // };

  // public static queryReservationsByBranch: ControllerHandler<Reservation[]> = async (req, res) => {
  //   const body: QueryByBranch = req.body;

  //   if (!body.branchId) {
  //     throw ErrorResponse.MissingRequiredParams();
  //   }

  //   const data = await ReservationsDB.queryReservationsByBranch(body.branchId);

  //   return res.send(ApiResponse.success(data));
  // };

  public static setPosReservations: ControllerHandler<null> = async (req, res) => {
    const body: SetPosReservationsBody = req.body;

    if (!body.branchId || !body.reservations || !body.externalBranchId || !body.removed) {
      throw ErrorResponse.InvalidParams();
    }

    const newReservations = body.reservations.filter((r) => r.isNew);

    if (newReservations.length) {
      await ReservationsDB.setReservationsFromPos(body.branchId, body.reservations);
      // TODO: send to external host service this new reservations
    }

    if (body.reservations.length || body.removed.length || body.init) {
      await RealTimeService.setReservations(body.branchId, body.reservations, body.removed, !!body.init);
    }

    res.send(ApiResponse.success(null));
  };

  public static mergeOrdersToReservations: ControllerHandler<null> = async (req, res) => {
    const body: MergeOrdersToReservationBody = req.body;

    if (!body.branchName || !body.orders?.length) {
      throw ErrorResponse.InvalidParams();
    }

    const result = await ReservationsDB.mergeOrdersToReservations(body.branchName, body.orders);
    // TODO: update external reservation serivce with the new sync inculde the pos order.

    res.send(ApiResponse.success(null));
  };
}
