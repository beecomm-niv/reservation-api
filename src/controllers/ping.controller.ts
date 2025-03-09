import { ControllerHandler } from '../models/controller-handler.model';
import { version } from '../../package.json';
import { ApiResponse } from '../models/api-response.model';

export class PingController {
  public static ping: ControllerHandler<string> = async (_, res) => {
    res.send(ApiResponse.success(`v${version}`));
  };
}
