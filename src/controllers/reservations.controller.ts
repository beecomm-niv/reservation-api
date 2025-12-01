import { ReservationsDB } from '../db/reservations.db';
import { ApiResponse } from '../models/api-response.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';
import { Order } from '../models/order.model';
import { Sync } from '../models/sync.model';
import { AdapterService } from '../services/adapter.service';
import { OntopoService } from '../services/ontopo.service';
import { ReservationsService } from '../services/reservations.service';
import { ReservationDto } from '../models/reservation';
import { LogService } from '../services/log.service';
import { LogSeverity } from '../models/log.model';
import { BranchesDB } from '../db/branches.db';
import { TelegramService } from '../services/telegram.service';

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

    try {
      if (!branchId || !params) {
        throw ErrorResponse.InvalidParams();
      }

      await ReservationsDB.saveReservation(branchId, params);
      await AdapterService.getInstance().sendReservation(branchId, params);

      this.saveLog('INFO', 'Reservation set successfully', branchId, params);

      res.json(ApiResponse.success(null));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      this.saveLog('ERROR', message, branchId, params);
      this.sendTelegramAlert(message, branchId).catch(() => {});

      throw error;
    }
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

  public static getTodayReservations: ControllerHandler<ReservationDto[]> = async (req, res) => {
    const { externalBranchId } = req.body;

    if (!externalBranchId) {
      throw ErrorResponse.InvalidParams();
    }

    const syncs = await OntopoService.getInstance().getTodayReservations(externalBranchId);
    const reservations = syncs.map(ReservationsService.convertSyncToReservationDto);

    return res.json(ApiResponse.success(reservations));
  };

  private static saveLog = (severity: LogSeverity, message: string, branchId: string | undefined, sync: Sync | undefined) => {
    const payload = sync ? ReservationsService.convertSyncToReservationDto(sync) : {};

    LogService.getInstance().saveLog(severity, message, { branchId: branchId || 'empty', ...payload });
  };

  private static sendTelegramAlert = async (errorMessage: string, branchId: string | undefined) => {
    let branchName = 'unknown';
    if (branchId) {
      const branch = await BranchesDB.findByPosBranchId(branchId);
      if (branch) {
        branchName = branch.name;
      }
    }

    await TelegramService.getInstance().sendTelegramMessage(`branch: <b>${branchName}</b>\nerror: <b>${errorMessage}</b>`, '-5036944241', true);
  };
}
