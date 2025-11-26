import { ApiResponse } from '../models/api-response.model';
import { ErrorResponse } from '../models/error-response.model';
import { ControllerErrorHandler } from '../models/controller-handler.model';
import { LogService } from '../services/log.service';

export class ErrorController {
  public static handle: ControllerErrorHandler = (err, req, res, next) => {
    let message = 'unknown error';
    let code = 500;

    if (err instanceof Error) {
      message = err.message;
    }

    if (req.logPayload) {
      LogService.getInstance().saveLog('ERROR', message, req.logPayload);
    }

    if (err instanceof ErrorResponse) {
      code = err.code;
    }

    res.status(Math.min(code, 500)).send(ApiResponse.error(code, message));
  };
}
