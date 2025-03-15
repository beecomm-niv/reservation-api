import { BranchesDB } from '../db/branches.db';
import { ApiResponse } from '../models/api-response.model';
import { Branch } from '../models/branch.model';
import { ControllerHandler } from '../models/controller-handler.model';
import { ErrorResponse } from '../models/error-response.model';

interface CreateBranchBody {
  name: string;
  posBranchId: string;
  reservationsBranchId: string;
}

export class BranchesController {
  public static createBranch: ControllerHandler<Branch> = async (req, res) => {
    const { name, posBranchId, reservationsBranchId }: CreateBranchBody = req.body;

    if (!name || !posBranchId || !reservationsBranchId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const result = await BranchesDB.createBranch(name, posBranchId, reservationsBranchId);

    res.send(ApiResponse.success(result));
  };

  public static getBranchById: ControllerHandler<Branch> = async (req, res) => {
    const id = req.params.id;

    if (!id) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const branch = await BranchesDB.getBranchById(id);

    res.send(ApiResponse.success(branch));
  };
}
