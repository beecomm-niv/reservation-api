import { ApiResponse } from '../models/api-response.model';
import { ErrorResponse } from '../models/error-response.model';
import { ControllerErrorHandler } from '../models/controller-handler.model';

export class ErrorController {
  public static handle: ControllerErrorHandler = (err, req, res, next) => {
    let message = 'unknown error';
    let code = 500;

    if (err instanceof Error) {
      message = err.message;
    }

    if (err instanceof ErrorResponse) {
      code = err.code;
    }

    return res.status(Math.min(code, 500)).send(ApiResponse.error(code, message));
  };
}
