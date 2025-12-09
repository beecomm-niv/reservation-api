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

    return res.json(ApiResponse.success(result));
  };

  public static getBranchById: ControllerHandler<Branch> = async (req, res) => {
    const id = req.params.id;

    if (!id) {
      throw ErrorResponse.MissingRequiredParams();
    }

    const branch = await BranchesDB.getBranchById(id);

    return res.json(ApiResponse.success(branch));
  };

  public static updateBranch: ControllerHandler<null> = async (req, res) => {
    const body: Partial<Branch> = req.body;

    if (!body.branchId) {
      throw ErrorResponse.MissingRequiredParams();
    }

    await BranchesDB.updateBranch(body.branchId, body);

    return res.json(ApiResponse.success(null));
  };
}
