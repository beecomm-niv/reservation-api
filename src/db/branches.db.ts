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
}
