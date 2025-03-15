import { Branch } from '../models/branch.model';
import { DB } from './db';

import { v4 } from 'uuid';

export class BranchesDB {
  private static readonly TABLE_NAME = 'branches';

  public static createBranch = async (name: string, posBranchId: string, reservationsBranchId: string) => {
    const branch: Branch = {
      branchId: v4(),
      name,
      posBranchId,
      reservationsBranchId,
    };

    await DB.getInstance().setItemByKey(this.TABLE_NAME, branch, {
      deniedOverride: true,
      primaryKey: 'branchId',
    });

    return branch;
  };

  public static getBranchById = async (branchId: string) => await DB.getInstance().findItemByKey<Branch>(this.TABLE_NAME, { branchId });

  public static getBranchOrNull = async (branchId: string): Promise<Branch | null> => {
    try {
      return await this.getBranchById(branchId);
    } catch {
      return null;
    }
  };
}
